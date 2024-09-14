// controllers/paymentController.js
const dotenv = require('dotenv');// dotenv.config({ path: './config.env' });
dotenv.config();
const Payment = require('../models/paymentModel');
const Rent = require('../models/Rent');
// const config = require('../config/config');
const WaafiPay = require('waafipay-sdk-node');
const moment = require('moment-timezone');
const waafipay = new WaafiPay.API(
  process.env.API_KEY,
  process.env.APIUSERID,
  process.env.MERCHANTUID, 
  { testMode: true }
);

const preAuthorizeCancel = (params) => {
  return new Promise((resolve, reject) => {
    waafipay.preAuthorizeCancel(params, (error, body) => {
      if (error) {
        return reject(error);
      }
      resolve(body);
    });
  });
};

const preAuthorize = (params) => {
  return new Promise((resolve, reject) => {
    waafipay.preAuthorize(params, (error, body) => {
      if (error) {
        return reject(error);
      }
      resolve(body);
    });
  });
};

const preAuthorizeCommit = (params) => {
  return new Promise((resolve, reject) => {
    waafipay.preAuthorizeCommit(params, (error, body) => {
      if (error) {
        return reject(error);
      }
      resolve(body);
    });
  });
};


// exports.savePaymentInfoWithUserInfo = async (req, res) => {
//   try {

//     const paymentInfo = await Payment.create(req.body); // Directly use req.body
//     // we also need to save the rent information in the database

//    req.body.paymentId = paymentInfo._id;
//    req.body.status = 'active';
//    req.body.powerbankId = req.body.stationId;
//     req.body.startTime = new Date();
//     req.body.endTime = req.body.endTime;
//     const rentInfo = await Rent.create(req.body);
  
//     return res.status(200).json({
//       message: "The payment operation is completed",
//       paymentInfo: paymentInfo,
//       rentInfo: rentInfo,

//     });
//   } catch (error) {
//     console.error('Error during paymentSaveInfo API call:', error);
//     res.status(400).json({ message: 'Payment saving request failed', error: error.message });
//   }
// };
// exports.savePaymentInfoWithUserInfo = async (req, res) => {
//   try {
//     // Prepare payment data
//     const paymentData = {
//       stationId: req.body.stationName,
//       phoneNumber: req.body.phoneNumber,
//       slotId: req.body.slotId,
//       evcReference: req.body.evcReference,
//       timestampEvc: req.body.timestampEvc,
//       amount: req.body.amount,
//       isPaid: req.body.isPaid,
//       endRentTime: req.body.endRentTime,
//       startTime: req.body.startTime,
//       hoursPaid: req.body.hoursPaid,
//       millisecondsPaid: req.body.millisecondsPaid,
//       currency: req.body.currency,
//       paymentStatus: req.body.paymentStatus,
//       lockStatus: req.body.lockStatus
//     };

//     // Create payment record
//     const paymentInfo = await Payment.create(paymentData);
//     console.log('Payment Info:', paymentInfo);
//     console.warn('Payment ID:', paymentInfo._id);

//     // Prepare rent data
//     const rentData = {
//       phoneNumber: req.body.phoneNumber,
//       paymentId: paymentInfo._id,
//       powerbankId: req.body.stationName, // or another field if different
//       startTime: req.body.startTime,
//       endTime: req.body.endRentTime,
//       status: 'active',
//     };

//     // Create rent record
//     const rentInfo = await Rent.create(rentData);

//     // Respond with created records
//     return res.status(200).json({
//       message: "The rent operation is completed",
//       paymentInfo: paymentInfo,
//       rentInfo: rentInfo,
//     });
//   } catch (error) {
//     console.error('Error during savePaymentInfoWithUserInfo API call:', error);
//     return res.status(400).json({ message: 'Payment saving request failed', error: error.message });
//   }
// };

exports.savePaymentInfoWithUserInfo = async (req, res) => {
  try {
    // Log the incoming request body for debugging
    console.log('Request Body:', req.body);

    // Prepare payment data
    const paymentData = {
      stationId: req.body.stationName,
      branch_name: req.body.branch_name,
      phoneNumber: req.body.phoneNumber,
      slotId: req.body.slotId,
      createdAt: req.body.createdAt,
      battery_id: req.body.battery_id,
      evcReference: req.body.evcReference,
      timestampEvc: req.body.timestampEvc,
      amount: req.body.amount,
      isPaid: req.body.isPaid,
      endRentTime: req.body.endRentTime,
      startTime: req.body.startTime,
      hoursPaid: req.body.hoursPaid,
      millisecondsPaid: req.body.millisecondsPaid,
      currency: req.body.currency,
      paymentStatus: req.body.paymentStatus,
      lockStatus: req.body.lockStatus,
      terms_and_conditions: req.body.terms_and_conditions,
    };
    console.log('Payment Data before:', paymentData);

    // Create payment record and await the result
    const paymentInfo = await Payment.create(paymentData);
    console.log('Payment Info Saved:', paymentInfo);

    // Prepare rent data
    const rentData = {
      phoneNumber: req.body.phoneNumber,
      paymentId: paymentInfo._id,
      createdAt: req.body.createdAt,
      powerbankId: req.body.stationName, // Assuming powerbankId is the correct field
      startTime: req.body.startTime,
      endTime: req.body.endRentTime,
      status: 'active',
    };

    // Create rent record and await the result
    const rentInfo = await Rent.create(rentData);
    console.log('Rent Info Saved:', rentInfo);

    // Respond with created records
    return res.status(200).json({
      message: "The rent operation is completed",
      paymentInfo: paymentInfo,
      rentInfo: rentInfo,
    });
  } catch (error) {
    // Log the specific error for debugging
    console.error('Error during savePaymentInfoWithUserInfo API call:', error);
    return res.status(400).json({ message: 'Payment saving request failed', error: error.message });
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



// exports.updatePaymentStatus = async (req, res) => {
//   const { phoneNumber } = req.params;

//   try {
//     // Get the current date and time in UTC
//     const currentDateTime = new Date();
    
//     // Formatting the current date time in ISO 8601 format for Africa/Mogadishu time zone
//     const timeManager = new Intl.DateTimeFormat("en-GB", {
//       timeZone: "Africa/Mogadishu",
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: false
//     });

//     const parts = timeManager.formatToParts(currentDateTime).reduce((acc, part) => {
//       acc[part.type] = part.value;
//       return acc;
//     }, {});

//     const formattedDate = `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}Z`;
//     console.log("Mogadishu Time (ISO 8601):", formattedDate);

//     const formattedDateObject = new Date(formattedDate);
//     const currentTimeMS = formattedDateObject.getTime();
//     const currentMonth = formattedDateObject.getMonth() + 1;
//     const currentYear = formattedDateObject.getFullYear();

//     console.log("Current Month:", currentMonth);
//     console.log("Current Year:", currentYear);

//     // Fetch the payment records based on phone number, active status, and lock status
//     const paymentInfo = await Payment.find({
//       phoneNumber,
//       paymentStatus: 'active',
//       lockStatus: 1
//     }).populate('paymentId');

//     if (paymentInfo.length === 0) {
//       console.log("No active payment found or lock status is not 1.");
//       return res.status(404).json({
//         message: "No active payment found for this phone number with the end time reached or almost reached and lock status of 1",
//       });
//     }

//     console.log("Payments Found:", paymentInfo);

//     let updatedPayments = [];

//     // Loop through each payment and update the status if the end time has been reached
//     for (let payment of paymentInfo) {
//       const paymentEndTime = new Date(payment.endRentTime);
//       const paymentEndTimeMS = paymentEndTime.getTime();

//       console.log("Payment End Time (ISO 8601):", payment.endRentTime);
//       console.log("Payment End Time (ms):", paymentEndTimeMS);
//       console.log("Current Time (ms):", currentTimeMS);

//       if (paymentEndTimeMS <= currentTimeMS || currentMonth !== (paymentEndTime.getMonth() + 1) || currentYear !== paymentEndTime.getFullYear()) {
//         console.log("The payment end time has been reached for payment ID:", payment._id);
//         payment.paymentStatus = 'inactive';
//         payment.lockStatus = 0;
//         await payment.save();
//         updatedPayments.push(payment);
//       }
//     }

//     if (updatedPayments.length === 0) {
//       return res.status(404).json({
//         message: "No active payments found for this phone number with the end time reached or almost reached and lock status of 1",
//       });
//     }

//     return res.status(200).json({
//       message: "Payment statuses updated successfully",
//       updatedPayments,
//     });
//   } catch (error) {
//     console.error('Error during updatePaymentStatus API call:', error);
//     res.status(500).json({ message: 'Request failed', error: error.message });
//   }
// };




// exports.updatePaymentStatus = async (req, res) => {
//   const { phoneNumber } = req.params;

//   try {
//     // Get the current date and time in the Africa/Mogadishu time zone
//     const currentDateTime = moment().tz("Africa/Mogadishu").toISOString();
//     console.log("Mogadishu Time (ISO 8601):", currentDateTime);

//     // Fetch the payment records based on phone number, active status, and lock status
//     const paymentInfo = await Payment.find({
//       phoneNumber,
//       paymentStatus: 'active',
//       lockStatus: 1
//     });

//     // If no active payments are found, return a 404 response

//    // rent should be expired if the end time is reached
//    const rentInfo = await Rent.find({
//     phoneNumber,
//     _id: paymentInfo._id,
//     status: 'active',
//   });

//     if (paymentInfo.length === 0) {
//       return res.status(404).json({
//         message: "No active payments found for this phone number with the end time reached or almost reached and lock status of 1",
//       });
//     }

//     let updatedPayments = [];

//     // Loop through each payment and update the status if the end time has been reached
//     for (let payment of paymentInfo) {
//       const paymentEndTime = new Date(payment.endRentTime);
//       const currentTimeMS = new Date(currentDateTime).getTime();
//       const paymentEndTimeMS = paymentEndTime.getTime();

//       console.log("Payment End Time (ISO 8601):", payment.endRentTime);
//       console.log("Payment End Time (ms):", paymentEndTimeMS);
//       console.log("Current Time (ms):", currentTimeMS);

//       if (paymentEndTimeMS <= currentTimeMS) {
//         console.log("The payment end time has been reached for payment ID:", payment._id);
//         payment.paymentStatus = 'inactive';
//         payment.lockStatus = 0;
//         await payment.save();
//         updatedPayments.push(payment);
//       }
//     }

//     if (updatedPayments.length === 0) {
//       return res.status(404).json({
//         message: "No active payments found for this phone number with the end time reached or almost reached and lock status of 1",
//       });
//     }

//     return res.status(200).json({
//       message: "Payment statuses updated successfully",
//       updatedPayments,
//     });
//   } catch (error) {
//     console.error('Error during updatePaymentStatus API call:', error);
//     res.status(500).json({ message: 'Request failed', error: error.message });
//   }
// };

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



exports.evc_paymentRequest = async (req, res) => {
  console.log('Received request for evc_paymentRequest:', req.body);

  const { accountNo, amount, currency, description } = req.body;

  if (!accountNo || !amount || !currency || !description) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  try {
    const preAuthResult = await preAuthorize({
      paymentMethod: 'MWALLET_ACCOUNT',
      accountNo: accountNo,
      amount: amount,
      currency: currency,
      description: description,
    });

    const transactionId = preAuthResult.params?.transactionId;
    if (!transactionId) {
      throw new Error('TransactionId is not provided in the preAuthorize response');
    }

    const commitResult = await preAuthorizeCommit({
      transactionId: transactionId,
      description: 'committed',
    });

    res.status(200).json(commitResult);
  } catch (error) {
    console.error('Error during WaafiPay API call:', error);
    res.status(400).json({ message: 'Payment request failed', error: error.message });
  }
};

exports.cancelPayment = async (req, res, next) => {
  try {
    const { transactionId } = req.body;
    if (!transactionId) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }
    const cancelResult = await preAuthorizeCancel({
      transactionId: transactionId,
      description: 'cancelled',
    });
    res.status(200).json(cancelResult);
  } catch (error) {
    console.error('Error during WaafiPay API call:', error);
    res.status(400).json({ message: 'Payment request failed', error: error.message });
  }
};

exports.createPayment = async (req, res, next) => {
  console.log(req.body);
  // Implementation here
};

exports.unlock = async (req, res, next) => {
  try {
    res.status(201).json({
      status: 'Unlocking is successful',
    });
  } catch (err) {
    console.error('Error during unlocking:', err);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};
