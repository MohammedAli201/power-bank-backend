
// const Payment = require('../models/paymentModel');
// const Rent = require('../models/Rent');
// const { forceUnlockSlot } = require('./powerBankController'); // Import your function
// const { savePaymentInfoWithUserInfo } = require('../utiliz/paymentUtils'); // Import the save payment function
// const { preAuthorize, preAuthorizeCommit, preAuthorizeCancel } = require('../utiliz/WafiPay');
// const moment = require('moment-timezone');
// const { createPaymentData, createRentData } = require('../utiliz/dataFactory');



// const catchAsync = fn => (req, res, next) => {
//   fn(req, res, next).catch(next);
// };



// exports.evc_paymentRequest = catchAsync(async (req, res, next) => {
//   console.log('Received request for evc_paymentRequest:', req.body);

//   const {
//     stationName,
//     userId,
//     amount,
//     accountNo,
//     hours: hoursPaid,
//     currency,
//     description,
//     branch_name,
//     battery_id,
//     slot_id,
//     timestampEvc,
//     createdAt,
//     isPaid,
//     endRentTime,
//     startTime,
//     millisecondsPaid,
//     paymentStatus,
//     lockStatus,
//     term_and_conditions
//   } = req.body;

//   if (!accountNo || !amount || !currency || !description) {
//     return res.status(400).json({ message: 'Missing required parameters' });
//   }

//   // Step 1: Pre-authorize the payment
//   const preAuthResult = await preAuthorize({
//     paymentMethod: 'MWALLET_ACCOUNT',
//     accountNo: accountNo,
//     amount: amount,
//     currency: currency,
//     description: description,
//   });
//   console.log('PreAuthorize Result:', preAuthResult);

//   const transactionId = preAuthResult.params?.transactionId;
//   if (!transactionId) {
//     return next(new AppError('Failed to pre-authorize the payment', 402));

//   }

//   // Step 2: Force unlock the power bank
//   const stationId = stationName;
//   const unlockResult = await forceUnlockSlot(stationId, slot_id);
//   console.log('Power bank unlock result:', unlockResult);
//   console.log('Power bank unlock result:', unlockResult.unlock);

//   if (unlockResult.unlock == false) {
//     await preAuthorizeCancel({
//       transactionId: transactionId,
//       description: 'cancelled',
//     });
//     return next(AppError('Failed to unlock the power bank', 402));

//   }
//       // Prepare payment data
//       const paymentData = {
//         stationId: req.body.stationName,
//         branch_name: req.body.branch_name,
//         phoneNumber: req.body.phoneNumber,
//         slotId: req.body.slot_id || 1,
//         createdAt: req.body.createdAt,
//         battery_id: req.body.battery_id || 1,
//         evcReference: transactionId,
//         timestampEvc: req.body.timestampEvc || new Date(),
//         amount: req.body.amount,
//         isPaid: req.body.isPaid,
//         endRentTime: req.body.endRentTime,
//         startTime: req.body.startTime,
//         hoursPaid: req.body.hoursPaid,
//         millisecondsPaid: req.body.millisecondsPaid,
//         currency: req.body.currency,
//         paymentStatus: req.body.paymentStatus,
//         lockStatus: req.body.lockStatus,
//         term_and_conditions: req.body.term_and_conditions,
//       };
  
//       // Create payment record and await the result
  
  
//       console.log('Payment Data before:', paymentData);
  
//       // Create payment record and await the result
//       const paymentInfo = await Payment.create(paymentData);
//       console.log('Payment Info Saved:', paymentInfo);
  
//       // Prepare rent data
//       const rentData = {
//         phoneNumber: req.body.phoneNumber,
//         paymentId: paymentInfo._id,
//         createdAt: req.body.createdAt,
//         powerbankId: req.body.stationName, // Assuming powerbankId is the correct field
//         startTime: req.body.startTime,
//         endTime: req.body.endRentTime,
//         status: 'active',
//       };
  
//       // Create rent record and await the result
//       const rentInfo = await Rent.create(rentData);
//       if (!rentInfo) {
//         return next(AppError('Failed to create rent record', 402));
//       }
//       const commitResult = await preAuthorizeCommit({
//         transactionId: transactionId,
//         description: 'committed',
//       });
  
//   // Step 5: Respond with success and data
//   res.status(200).json({
//     message: 'Payment request successful, power bank unlocked, and payment committed',
    
//   });
// });



// exports.findByPhoneNumber = async (req, res) => {
//   const { phoneNumber } = req.params; // Assuming the phone number is passed as a URL parameter
//   console.log(typeof(phoneNumber))

//   try {
//     // const paymentInfo = await Rent.find()
//     // const paymentInfo = await Rent.find().sort({ createdAt: -1 }); // Sort by latest
//     const paymentInfo = await Rent.find({}, '-__v -_id')
      
//     .populate({path:'paymentId', select:"-__v -_id"}).sort({ createdAt: -1 }); // Sort by latest and populate paymentId

//     // const paymentInfo = await Rent.find({phoneNumber}).populate({
//     //   path:'paymentId',
//     // });
//     if (!paymentInfo.length) {
//       return res.status(404).json({
//         message: "No Rent information found for this phone number",
//       });
//     }
//     return res.status(200).json({
//       message: "Rent information retrieved successfully",
//       paymentInfo,
//     });
//   } catch (error) {
//     console.error('Error during findByPhoneNumber API call:', error);
//     res.status(500).json({ message: 'Request failed', error: error.message });
//   }
// };







// exports.updatePaymentStatus = catchAsync(async (req, res, next) => {
//   const { phoneNumber } = req.params;
//   console.log("Phone Number:", phoneNumber)

//   // Get the current date and time in the Africa/Mogadishu time zone
//   const currentDateTime = moment().tz("Africa/Mogadishu").format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
//   console.log("Mogadishu Time (ISO 8601):", currentDateTime);
//   const currentTimeMS = new Date(currentDateTime).getTime();
//   console.log("Current Time (ms):", currentTimeMS);

//   // Fetch the payment records based on phone number, active status, and lock status
//   const paymentInfo = await Payment.find({
//     phoneNumber,
//     paymentStatus: 'active',
//     lockStatus: 1
//   });
// console.log(paymentInfo)
//   if (paymentInfo.length === 0) {
//     return res.status(404).json({
//       message: "No active payments found for this phone number with the end time reached or almost reached and lock status of 1",
//     });

//   }

//   let updatedPayments = [];
//   let updatedRents = [];

//   // Loop through each payment and update the status if the end time has been reached
//   for (let payment of paymentInfo) {
//     const paymentEndTime = new Date(payment.endRentTime);
//     const paymentEndTimeMS = paymentEndTime.getTime();


//     if (paymentEndTimeMS <= currentTimeMS) {

//       // Update the payment status and lock status
//       payment.paymentStatus = 'inactive';
//       payment.lockStatus = 0;
//       payment.term_and_conditions = true;
//       await payment.save();
//       updatedPayments.push(payment);

//       // Also update the associated rent status to inactive
//       const rent = await Rent.findOne({ phoneNumber, paymentId: payment._id, status: 'active' });
//       if (rent) {
//         rent.status = 'expired';
//         await rent.save();
//         updatedRents.push(rent);
//       }
//     }
//   }

//   if (updatedPayments.length === 0 && updatedRents.length === 0) {
//     return next(new Error("No active payments or rents found for this phone number with the end time reached or almost reached and lock status of 1"));

    
//   }

//   return res.status(200).json({
//     message: "Payment and rent statuses updated successfully",
//     updatedPayments,
//     updatedRents,
//   });
// });




// exports.cancelPayment = catchAsync(async (req, res) => {
//   const { transactionId } = req.body;

//   if (!transactionId) {
//     return res.status(400).json({ message: 'Missing required parameters' });
//   }

//   const cancelResult = await preAuthorizeCancel({
//     transactionId: transactionId,
//     description: 'cancelled',
//   });

//   res.status(200).json(cancelResult);
// });


const Payment = require('../models/paymentModel');
const Rent = require('../models/Rent');
const { forceUnlockSlot } = require('./powerBankController'); 
const { preAuthorize, preAuthorizeCommit, preAuthorizeCancel } = require('../utiliz/WafiPay');
const moment = require('moment-timezone');
const AppError = require('../utiliz/AppError');

// Utility to catch async errors
const catchAsync = fn => (req, res, next) => {
  fn(req, res, next).catch(next);
};

// Payment Request Handler
exports.evc_paymentRequest = catchAsync(async (req, res, next) => {
  console.log('Received request for evc_paymentRequest:', req.body);

  const {
    stationName,
    userId,
    amount,
    accountNo,
    hoursPaid,
    currency,
    description,
    branch_name,
    battery_id,
    slot_id,
    timestampEvc,
    createdAt,
    isPaid,
    endRentTime,
    startTime,
    millisecondsPaid,
    paymentStatus,
    lockStatus,
    term_and_conditions
  } = req.body;

  if (!accountNo || !amount || !currency || !description) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

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
    return next(new AppError('Failed to pre-authorize the payment', 402));
  }

  // Step 2: Force unlock the power bank
  const stationId = stationName;
  const unlockResult = await forceUnlockSlot(stationId, slot_id);
  console.log('Power bank unlock result:', unlockResult);

  if (unlockResult.unlock == false) {
    await preAuthorizeCancel({
      transactionId: transactionId,
      description: 'cancelled',
    });
    return next(new AppError('Failed to unlock the power bank', 402));
  }

  try {
    // Step 3: Create Payment Record
    const paymentData = {
      stationId: stationName,
      branch_name: branch_name,
      phoneNumber: req.body.phoneNumber,
      slotId: slot_id || 1,
      createdAt: createdAt,
      battery_id: battery_id || 1,
      evcReference: transactionId,
      timestampEvc: timestampEvc || new Date(),
      amount: amount,
      isPaid: isPaid,
      endRentTime: endRentTime,
      startTime: startTime,
      hoursPaid: hoursPaid,
      millisecondsPaid: millisecondsPaid,
      currency: currency,
      paymentStatus: paymentStatus,
      lockStatus: lockStatus,
      term_and_conditions: term_and_conditions,
    };

    const paymentInfo = await Payment.create(paymentData);
    console.log('Payment Info Saved:', paymentInfo);

    // Step 4: Create Rent Record
    const rentData = {
      phoneNumber: req.body.phoneNumber,
      paymentId: paymentInfo._id,
      createdAt: createdAt,
      powerbankId: stationName,
      startTime: startTime,
      endTime: endRentTime,
      status: 'active',
    };

    const rentInfo = await Rent.create(rentData);
    if (!rentInfo) {
      return next(new AppError('Failed to create rent record', 402));
    }

    // Step 5: Commit Payment
    const commitResult = await preAuthorizeCommit({
      transactionId: transactionId,
      description: 'committed',
    });

    // Step 6: Respond with success
    res.status(200).json({
      message: 'Payment request successful, power bank unlocked, and payment committed',
      paymentInfo,
      rentInfo,
    });
  } catch (error) {
    return next(new AppError('Failed to complete the transaction', 500));
  }
});

// Find Payment by Phone Number
exports.findByPhoneNumber = catchAsync(async (req, res, next) => {
  const { phoneNumber } = req.params;

  const paymentInfo = await Rent.find({}, '-__v -_id')
    .populate({ path: 'paymentId', select: "-__v -_id" })
    .sort({ createdAt: -1 });

  if (!paymentInfo.length) {
    return next(new AppError("No Rent information found for this phone number", 404));
  }

  return res.status(200).json({
    message: "Rent information retrieved successfully",
    paymentInfo,
  });
});

// Update Payment Status
exports.updatePaymentStatus = catchAsync(async (req, res, next) => {
  const { phoneNumber } = req.params;

  // Get the current date and time in the Africa/Mogadishu time zone
  const currentDateTime = moment().tz("Africa/Mogadishu").format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  const currentTimeMS = new Date(currentDateTime).getTime();

  // Fetch the payment records
  const paymentInfo = await Payment.find({
    phoneNumber,
    paymentStatus: 'active',
    lockStatus: 1
  });

  if (!paymentInfo.length) {
    return next(new AppError("No active payments found for this phone number with the end time reached or almost reached and lock status of 1", 404));
  }

  let updatedPayments = [];
  let updatedRents = [];

  // Loop through each payment and update the status
  for (let payment of paymentInfo) {
    const paymentEndTimeMS = new Date(payment.endRentTime).getTime();

    if (paymentEndTimeMS <= currentTimeMS) {
      payment.paymentStatus = 'inactive';
      payment.lockStatus = 0;
      payment.term_and_conditions = true;
      await payment.save();
      updatedPayments.push(payment);

      const rent = await Rent.findOne({ phoneNumber, paymentId: payment._id, status: 'active' });
      if (rent) {
        rent.status = 'expired';
        await rent.save();
        updatedRents.push(rent);
      }
    }
  }

  if (!updatedPayments.length && !updatedRents.length) {
    return next(new AppError("No active payments or rents found to update", 404));
  }

  return res.status(200).json({
    message: "Payment and rent statuses updated successfully",
    updatedPayments,
    updatedRents,
  });
});

// Cancel Payment
exports.cancelPayment = catchAsync(async (req, res, next) => {
  const { transactionId } = req.body;

  if (!transactionId) {
    return next(new AppError('Missing required parameters', 400));
  }

  const cancelResult = await preAuthorizeCancel({
    transactionId: transactionId,
    description: 'cancelled',
  });

  res.status(200).json(cancelResult);
});
