// const express = require('express');
// const config = require('../config/config');
// const Payment = require('../models/paymentModel');
// const dotenv = require('dotenv');
// const multer = require('multer');
// const FormData = require('form-data');
// const sendSMS = require('../utiliz/smsUtils');
// const Message = require('../utiliz/smsUtils');

// const fetch = require('node-fetch');
// const router = express.Router();
// const Rent = require('../models/Rent');
// dotenv.config();
// const mongoose = require('mongoose');
// const URL = "https://openapi.heycharge.global/v1/station/";
// const upload = multer();
// const API_KEY = process.env.API_KEY_POWER_BANK;

// const catchAsync = fn => (req, res, next) => {

//     return (req,res,next) => {
//         fn(req,res,next).catch(next);
//     }
// }

// // exports.getReturnPowerBank = async (req, res) => {
// //     const { method, body, headers, params } = req;
// //     const { imei, battery_id, slot_id } = body;
  
// //     console.log('stationId:', imei);
// //     console.log('battery_id:', battery_id);
// //     console.log('slot_id:', slot_id);

  
// //     try {
// //       // Use $in to check for both "expired" and "active" statuses
// //       const rent = await Rent.findOne({ powerbankId: imei, status: { $in: ["expired", "active"] } });
// //         console.log('Rent:', rent); 
// //       if (!rent) {
// //         return res.json({
// //           message: "Power bank not returned successfully",
// //           type_error: "resourceNotFound",
// //         });
// //       }
  
// //       // Find the payment by paymentId, slotId, and battery_id with status "expired" or "active"
// //       const payment = await Payment.findOne({
// //         _id: rent.paymentId, // Ensure this is queried as ObjectId
// //         slotId: slot_id,
// //         battery_id: battery_id,
// //         // status: { $in: ["expired", "active","inactive"] },
// //       });
// //       console.log('payment id :', rent.paymentId);
// //       console.log('payment:', payment); 
  
// //       // Update payment status
// //       if (payment) {
// //         payment.status = "inactive";
// //         await payment.save();
// //       }
  
// //       // Update rent status
// //       rent.status = "returned";
// //       rent.lockStatus = 0;
// //       await rent.save();

// //       // send sms to user
// //       const sendMess = Message(phoneNumber) 
   
// //     const smsResponse = await sendSMS(phoneNumber, sendMess.message, sendMess.senderid);

  
// //       return res.json({ message: "Power bank returned successfully" ,
// //         smsResponse: smsResponse
// //       });
  
// //     } catch (error) {
// //       console.error('Error with API request:', error);
// //       return res.status(500).json({ error: 'Internal Server Error' });
// //     }
// //   };

  

  
//   exports.getReturnPowerBank = catchAsync(async (req, res, next) => {
//     const { method, body, headers, params } = req;
//     const { imei, battery_id, slot_id, phoneNumber } = body;

//     const rent = await Rent.findOne({ powerbankId: imei, status: { $in: ["expired", "active"] } });
//     console.log('Rent:', rent); 
  
//     if (!rent) {
//       return next(new Error("Power bank not returned successfully, resource not found"));
//     }
//     const payment = await Payment.findOne({
//       _id: rent.paymentId, // Ensure this is queried as ObjectId
//       slotId: slot_id,
//       battery_id: battery_id,
//     });
    
//     console.log('payment id :', rent.paymentId);
//     console.log('payment:', payment);
  
//     // Update payment status if found
//     if (payment) {
//       payment.status = "inactive";
//       await payment.save();
//     }
  
//     // Update rent status
//     rent.status = "returned";
//     rent.lockStatus = 0;
//     await rent.save();
  
//     // Send SMS to user
//     const sendMess = Message(phoneNumber);
//     const smsResponse = await sendSMS(phoneNumber, sendMess.message, sendMess.senderid);
  
//     return res.json({ 
//       message: "Power bank returned successfully",
//       smsResponse: smsResponse
//     });
//   });
  
// exports.getpowerBankStatusByStationId = async (req, res) => {
//     const { method, body, headers, params } = req;
   
//     console.log('Params:', req.params);
//     const { stationId } = params;
//     const targetUrl = `${URL}${stationId}`;
//     console.log('Target URL:', targetUrl);
//     console.log('Station Name:', stationId);

//     try {
//         const options = {
//             method,
//             headers: {
//                 'Authorization': `Basic ${Buffer.from(API_KEY + ':').toString('base64')}`,
//             }
//         };

//         if (method !== 'GET' && method !== 'HEAD' && body) {
//             if (body instanceof FormData) {
//                 options.body = body;
//             } else {
//                 options.headers['Content-Type'] = 'application/json';
//                 options.body = JSON.stringify(body);
//             }
//         }

//         console.log('API Service Request:', targetUrl, options);

//         const response = await fetch(targetUrl, options);
//         console.log('API Service Response:', response);

//         if (!response.ok) {
//             let errorType = `HTTP error! Status: ${response.status}`;
//             if (response.status === 402) {
//                 errorType = 'networkError.';
//             } else if (response.status === 400) {
//                 const errorData = await response.json();
//                 errorType = `Bad Request: ${errorData.message || response.statusText}`;
//             }
//             console.error('API Service Error:', errorType);
//             return res.status(response.status).json({ error: errorType });
//         }

//         const contentType = response.headers.get("content-type");
//         if (contentType && contentType.indexOf("application/json") !== -1) {
//             const data = await response.json();
//             return res.json(data);
//         } else {
//             const responseBody = await response.text();
//             res.set('Content-Type', contentType);
//             return res.send(responseBody);
//         }
//     } catch (error) {
//         console.error('Error with API request:', error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// // exports.forUnclockSlotsById = async (req, res) => {
// //     const { params, body } = req;
// //     const { stationId } = params;
// //     //const apiKey = process.env.apiKey;
// //     console.warn('API Key:', API_KEY);
    
// //     const { slotId } = body;
// //     // console.log('Slot ID:', slotId);

// //     const targetUrl = `${URL}${stationId}/forceUnlock`;
// //     console.log('Target URL:', targetUrl);

// //     try {
// //         const formData = new URLSearchParams(body).toString();

// //         const options = {
// //             method: 'POST',
// //             headers: {
// //                 'Authorization': `Basic ${Buffer.from(API_KEY + ':').toString('base64')}`,
// //                 'Content-Type': 'application/x-www-form-urlencoded',
// //             },
// //             body: formData
// //         };

// //         console.log('API Service Request:', targetUrl, options);

// //         const response = await fetch(targetUrl, options);

// //         if (!response.ok) {
// //             let errorType = `HTTP error! Status: ${response.status}`;
// //             if (response.status === 402) {
// //                 errorType = 'resourceNotFound';
// //             } else if (response.status === 400) {
// //                 const errorData = await response.json();
// //                 errorType = `networkError: `;
// //             }
// //             console.error('API Service Error from unlock router:', errorType);
// //             return res.status(response.status).json({ error: errorType });
// //         }

// //         const contentType = response.headers.get("content-type");
// //         if (contentType && contentType.indexOf("application/json") !== -1) {
// //             const data = await response.json();
// //             return res.json({
// //                 status: 'Unlocking is successful',
// //                 unlockTime: new Date().toISOString(),
// //                 unlocked: true,
// //                 stationId: stationId,
// //                 slotId: slotId,
// //             });
// //         } else {
// //             return res.status(200).send({
// //                 status: 'Unlocking is successful',
// //                 unlockTime: new Date().toISOString(),
// //                 unlocked: true,
// //                 stationId: stationId,
// //             });
// //         }
// //     } catch (error) {
// //         console.error('Error with API request:', error);
// //         return res.status(500).json({ error: 'networkError' , message : 'Internal Server Error' });
// //      }
// // };



// // Standalone function for programmatic use
// async function forceUnlockSlot(stationId, slot_id) {
//     const targetUrl = `${URL}${stationId}/forceUnlock`;
//     console.log('stationId:', targetUrl);

//     const formData = new URLSearchParams({ slot_id }).toString();
//     console.log('Form Data:', formData);    
//     const options = {
//         method: 'POST',
//         headers: {
//             'Authorization': `Basic ${Buffer.from(API_KEY + ':').toString('base64')}`,
//             'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: formData
//     };

//     console.log('API Service Request:', targetUrl, options);

//     const response = await fetch(targetUrl, options);

//     if (!response.ok) {
//         let errorType = `HTTP error! Status: ${response.status}`;
//         if (response.status === 402) {
//             return {
//                unlock : false,
//             };
//         } else if (response.status === 400) {
//             const errorData = await response.json();
//             return {
//                 unlock : false,
//                 error: `Unlocking failed: ${errorData.message || response.statusText || 'Bad Request'}`,
                
//             };
//         }
//         console.error('API Service Error from unlock router:', errorType);
//         throw new Error(`Unlocking failed: ${errorType}`);
//     }

//     const contentType = response.headers.get("content-type");
//     if (contentType && contentType.indexOf("application/json") !== -1) {
//         const data = await response.json();
//         return {
//             status: 'Unlocking is successful',
//             unlockTime: new Date().toISOString(),
//             unlocked: true,
//             stationId: stationId,
//             slot_id: slot_id,
//             data: data
//         };
//     } else {
//         return {
//             status: 'Unlocking is successful',
//             unlockTime: new Date().toISOString(),
//             unlocked: true,
//             stationId: stationId
//         };
//     }
// }

// // Express route handler
// exports.forUnclockSlotsById = async (req, res) => {
//     const { stationId } = req.params;
//     const { slot_id } = req.body;
//     console.log('Station ID:', stationId);
//     console.log('Slot ID:', slot_id);

//     try {
//         const result = await forceUnlockSlot(stationId, slot_id);
//         return res.json(result);
//     } catch (error) {
//         console.error('Error with API request:', error);
//         return res.status(500).json({ error: 'networkError', message: error.message });
//     }
// };

// // Exporting the standalone function for use in other files
// exports.forceUnlockSlot = forceUnlockSlot;
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types; // Import ObjectId from mongoose
const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const sendSMS = require('../utiliz/smsUtils');
const Message = require('../utiliz/smsUtils');
const fetch = require('node-fetch');
const Payment = require('../models/paymentModel');
const Rent = require('../models/Rent');
const AppError = require('../utiliz/AppError'); // Assuming you have an AppError class
dotenv.config();

const router = express.Router();
const URL = "https://openapi.heycharge.global/v1/station/";
const upload = multer();
const API_KEY = process.env.API_KEY_POWER_BANK;

// Utility to catch async errors
const catchAsync = fn => (req, res, next) => {
  fn(req, res, next).catch(next);
};


// Return Power Bank Function with Improved Error Handling
exports.getReturnPowerBank = catchAsync(async (req, res, next) => {
  const { imei, battery_id, slot_id, phoneNumber } = req.body;

  console.log('IMEI:', imei);

  const rent = await Rent.findOne({ powerbankId: imei, status: { $in: ["expired", "active"] } });

  console.log('Rent:', rent);
  if (!rent) {
    return next(new AppError("Power bank not returned successfully, resource not found", 404));
  }
  console.log("slot_id", slot_id);
  


  const payment = await Payment.findOne({
    _id: (rent.paymentId),   // Ensure this is ObjectId
   
  });
    console.log('Payment ID:', rent.paymentId);
    console.log('Payment:', payment);
  
  


  if (!payment) {
    return next(new AppError('Payment not found for this power bank', 404));
  }

  // Update payment and rent status
  payment.status = "inactive";
  await payment.save();

  rent.status = "returned";
  rent.lockStatus = 0;
  await rent.save();

  // Send SMS to the user
  const sendMess = Message(phoneNumber);
  const smsResponse = await sendSMS(phoneNumber, sendMess.message, sendMess.senderid);

  return res.status(200).json({
    message: "Power bank returned successfully",
    smsResponse: smsResponse,
  });
});



// Get Power Bank Status by Station ID with Improved Error Handling
exports.getpowerBankStatusByStationId = catchAsync(async (req, res, next) => {
  const { stationId } = req.params;
  const targetUrl = `${URL}${stationId}`;

  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${Buffer.from(API_KEY + ':').toString('base64')}`,
    },
  };

  const response = await fetch(targetUrl, options);

  if (!response.ok) {
    let errorMessage = `HTTP error! Status: ${response.status}`;
    if (response.status === 400) {
      const errorData = await response.json();
      errorMessage = `Bad Request: ${errorData.message || 'Invalid Request'}`;
    } else if (response.status === 402) {
      errorMessage = 'Payment required (402)';
    }
    return next(new AppError(errorMessage, response.status));
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    const data = await response.json();
    return res.status(200).json(data);
  } else {
    const responseBody = await response.text();
    res.set('Content-Type', contentType);
    return res.send(responseBody);
  }
});

// Unlock Power Bank Slot Function with Better Error Handling
async function forceUnlockSlot(stationId, slot_id) {
  const targetUrl = `${URL}${stationId}/forceUnlock`;

  const formData = new URLSearchParams({ slot_id }).toString();
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(API_KEY + ':').toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  };

  const response = await fetch(targetUrl, options);

  if (!response.ok) {
    let errorType = `HTTP error! Status: ${response.status}`;
    if (response.status === 400) {
      const errorData = await response.json();
      errorType = `Unlocking failed: ${errorData.message || 'Bad Request'}`;
    }
    return {
      unlock: false,
      error: errorType,
    };
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    const data = await response.json();
    return {
      status: 'Unlocking is successful',
      unlockTime: new Date().toISOString(),
      unlocked: true,
      stationId: stationId,
      slot_id: slot_id,
      data: data
    };
  }

  return {
    status: 'Unlocking is successful',
    unlockTime: new Date().toISOString(),
    unlocked: true,
    stationId: stationId
  };
}

// Unlock Power Bank Slot API Endpoint
exports.forUnclockSlotsById = catchAsync(async (req, res, next) => {
  const { stationId } = req.params;
  const { slot_id } = req.body;

  try {
    const result = await forceUnlockSlot(stationId, slot_id);
    if (!result.unlocked) {
      return next(new AppError(result.error || 'Unlocking failed', 400));
    }
    return res.status(200).json(result);
  } catch (error) {
    return next(new AppError('Failed to unlock the slot', 500));
  }
});

// Export the standalone function for programmatic use
exports.forceUnlockSlot = forceUnlockSlot;
