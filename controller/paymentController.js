

const { forceUnlockSlot } = require('./powerBankController'); // Import your function
const { savePaymentInfoWithUserInfo } = require('../utiliz/paymentUtils'); // Import the save payment function
const { preAuthorize, preAuthorizeCommit } = require('../utiliz/WafiPay');
const moment = require('moment-timezone');
const { createPaymentData, createRentData } = require('../utiliz/dataFactory');

exports.evc_paymentRequest = async (req, res) => {
  console.log('Received request for evc_paymentRequest:', req.body);

  const { accountNo, amount, currency, description, stationId, slotId, phoneNumber, stationName, branch_name } = req.body;

  if (!accountNo || !amount || !currency || !description) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  try {
    // Step 1: Pre-authorize the payment
    const preAuthResult = await preAuthorize({
      paymentMethod: 'MWALLET_ACCOUNT',
      accountNo: accountNo,
      amount: amount,
      currency: currency,
      description: description,
    });
    console.log('PreAuthorize Result:', preAuthResult);

    const transactionId = preAuthResult.params?.transactionId;
    if (!transactionId) {
      throw new Error('TransactionId is not provided in the preAuthorize response');
    }
    const slot_id = slotId;
    // Step 2: Force unlock the power bank
    const unlockResult = await forceUnlockSlot(stationId, slot_id);
    console.log('Power bank unlock result:', unlockResult);
    if (!unlockResult.unlocked) {
      // cancel the payment if the power bank is not unlocked
      const cancelResult = await preAuthorizeCancel({
        transactionId: transactionId,
        description: 'cancelled',
      });
      throw new Error('Failed to unlock the power bank');

    }

     // Step 3: Commit the payment
     const commitResult = await preAuthorizeCommit({
      transactionId: transactionId,
      description: 'committed',
    });
    console.log('Commit Result:', commitResult);

    // Step 4: Use the factory functions to create payment and rent data
    const paymentData = createPaymentData(req.body, transactionId, unlockResult,commitResult);
    const rentData = createRentData(req.body, paymentData.paymentId);
    const savePaymentResult = await savePaymentInfoWithUserInfo(paymentData, rentData);
    console.log('Payment and Rent saved:', savePaymentResult);

    // Step 5: Respond with success and data
    res.status(200).json({
      message: 'Payment request successful, power bank unlocked, and payment committed',
      unlockResult,
      paymentInfo: savePaymentResult.paymentInfo,
      rentInfo: savePaymentResult.rentInfo,
      commitResult,
    });
  } catch (error) {
    console.error('Error during WaafiPay API call:', error);
    res.status(400).json({ message: 'Payment request failed', error: error.message });
  }
};

exports.findByPhoneNumber = async (req, res) => {
  const { phoneNumber } = req.params; // Assuming the phone number is passed as a URL parameter
  console.log(typeof(phoneNumber))

  try {
    // const paymentInfo = await Rent.find()
    // const paymentInfo = await Rent.find().sort({ createdAt: -1 }); // Sort by latest
    const paymentInfo = await Rent.find({}, '-__v -_id')
      
    .populate({path:'paymentId', select:"-__v -_id"}).sort({ createdAt: -1 }); // Sort by latest and populate paymentId

    // const paymentInfo = await Rent.find({phoneNumber}).populate({
    //   path:'paymentId',
    // });
    if (!paymentInfo.length) {
      return res.status(404).json({
        message: "No Rent information found for this phone number",
      });
    }
    return res.status(200).json({
      message: "Rent information retrieved successfully",
      paymentInfo,
    });
  } catch (error) {
    console.error('Error during findByPhoneNumber API call:', error);
    res.status(500).json({ message: 'Request failed', error: error.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  const { phoneNumber } = req.params;

  try {
    // Get the current date and time in the Africa/Mogadishu time zone
    const currentDateTime = moment().tz("Africa/Mogadishu").format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    console.log("Mogadishu Time (ISO 8601):", currentDateTime);
    const currentTimeMS = currentDateTime.valueOf();
console.log("Current Time (ms):", currentTimeMS);
    // console.log(moment.tz.names());

    // Fetch the payment records based on phone number, active status, and lock status
    const paymentInfo = await Payment.find({
      phoneNumber,
      paymentStatus: 'active',
      lockStatus: 1
    });

    if (paymentInfo.length === 0) {
      return res.status(404).json({
        message: "No active payments found for this phone number with the end time reached or almost reached and lock status of 1",
      });
    }

    let updatedPayments = [];
    let updatedRents = [];

    // Loop through each payment and update the status if the end time has been reached
    for (let payment of paymentInfo) {
      const paymentEndTime = new Date(payment.endRentTime);
      const currentTimeMS = new Date(currentDateTime).getTime();
      const paymentEndTimeMS = paymentEndTime.getTime();

      console.log("Payment End Time (ISO 8601):", payment.endRentTime);
      console.log("Payment End Time (ms):", paymentEndTimeMS);
      console.log("Current Time (ms):", currentTimeMS);

      if (paymentEndTimeMS <= currentTimeMS) {
        console.log("The payment end time has been reached for payment ID:", payment._id);

        // Update the payment status and lock status
        payment.paymentStatus = 'inactive';
        payment.lockStatus = 0;
        payment.term_and_conditions= true
        await payment.save();
        updatedPayments.push(payment);

        // Also update the associated rent status to inactive
        const rent = await Rent.findOne({ phoneNumber, paymentId: payment._id, status: 'active' });
        if (rent) {
          rent.status = 'expired';
          await rent.save();
          updatedRents.push(rent);
        }
      }
    }

    
    if (updatedPayments.length === 0 && updatedRents.length === 0) {
      return res.status(404).json({
        message: "No active payments or rents found for this phone number with the end time reached or almost reached and lock status of 1",
      });
    }

    return res.status(200).json({
      message: "Payment and rent statuses updated successfully",
      updatedPayments,
      updatedRents,
    });
  } catch (error) {
    console.error('Error during updatePaymentStatus API call:', error);
    res.status(500).json({ message: 'Request failed', error: error.message });
  }
};






