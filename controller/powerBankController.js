const express = require('express');
const config = require('../config/config');
const Payment = require('../models/paymentModel');
const dotenv = require('dotenv');
const multer = require('multer');
const FormData = require('form-data');
const sendSMS = require('../utiliz/smsUtils');

const fetch = require('node-fetch');
const router = express.Router();
const Rent = require('../models/Rent');
dotenv.config();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const URL = "https://openapi.heycharge.global/v1/station/";
const upload = multer();
const API_KEY = process.env.API_KEY_POWER_BANK;

exports.getReturnPowerBank = async (req, res) => {
    const { method, body, headers, params } = req;
    const { imei, battery_id, slot_id } = body;
  
    console.log('stationId:', imei);
    console.log('battery_id:', battery_id);
    console.log('slot_id:', slot_id);

  
    try {
      // Use $in to check for both "expired" and "active" statuses
      const rent = await Rent.findOne({ powerbankId: imei, status: { $in: ["expired", "active"] } });
        console.log('Rent:', rent); 
      if (!rent) {
        return res.json({
          message: "Power bank not returned successfully",
          type_error: "resourceNotFound",
        });
      }
  
      // Find the payment by paymentId, slotId, and battery_id with status "expired" or "active"
      const payment = await Payment.findOne({
        _id: rent.paymentId, // Ensure this is queried as ObjectId
        slotId: slot_id,
        battery_id: battery_id,
        // status: { $in: ["expired", "active","inactive"] },
      });
      console.log('payment id :', rent.paymentId);
      console.log('payment:', payment); 
  
      // Update payment status
      if (payment) {
        payment.status = "inactive";
        await payment.save();
      }
  
      // Update rent status
      rent.status = "returned";
      rent.lockStatus = 0;
      await rent.save();

      // send sms to user
    const message = `Waad kumahadsantahy isticmaal adeegeyna!. Thank you for using our service.`;
    const phoneNumber = rent.phoneNumber;
    const senderid = 'Danab Power Bank';
    const smsResponse = await sendSMS(phoneNumber, message, senderid);

  
      return res.json({ message: "Power bank returned successfully" ,
        smsResponse: smsResponse
      });
  
    } catch (error) {
      console.error('Error with API request:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  

exports.getpowerBankStatusByStationId = async (req, res) => {
    const { method, body, headers, params } = req;
   
    console.log('Params:', req.params);
    const { stationId } = params;
    const targetUrl = `${URL}${stationId}`;
    console.log('Target URL:', targetUrl);
    console.log('Station Name:', stationId);

    try {
        const options = {
            method,
            headers: {
                'Authorization': `Basic ${Buffer.from(API_KEY + ':').toString('base64')}`,
            }
        };

        if (method !== 'GET' && method !== 'HEAD' && body) {
            if (body instanceof FormData) {
                options.body = body;
            } else {
                options.headers['Content-Type'] = 'application/json';
                options.body = JSON.stringify(body);
            }
        }

        console.log('API Service Request:', targetUrl, options);

        const response = await fetch(targetUrl, options);
        console.log('API Service Response:', response);

        if (!response.ok) {
            let errorType = `HTTP error! Status: ${response.status}`;
            if (response.status === 402) {
                errorType = 'networkError.';
            } else if (response.status === 400) {
                const errorData = await response.json();
                errorType = `Bad Request: ${errorData.message || response.statusText}`;
            }
            console.error('API Service Error:', errorType);
            return res.status(response.status).json({ error: errorType });
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();
            return res.json(data);
        } else {
            const responseBody = await response.text();
            res.set('Content-Type', contentType);
            return res.send(responseBody);
        }
    } catch (error) {
        console.error('Error with API request:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// exports.forUnclockSlotsById = async (req, res) => {
//     const { params, body } = req;
//     const { stationId } = params;
//     //const apiKey = process.env.apiKey;
//     console.warn('API Key:', API_KEY);
    
//     const { slotId } = body;
//     // console.log('Slot ID:', slotId);

//     const targetUrl = `${URL}${stationId}/forceUnlock`;
//     console.log('Target URL:', targetUrl);

//     try {
//         const formData = new URLSearchParams(body).toString();

//         const options = {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Basic ${Buffer.from(API_KEY + ':').toString('base64')}`,
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//             body: formData
//         };

//         console.log('API Service Request:', targetUrl, options);

//         const response = await fetch(targetUrl, options);

//         if (!response.ok) {
//             let errorType = `HTTP error! Status: ${response.status}`;
//             if (response.status === 402) {
//                 errorType = 'resourceNotFound';
//             } else if (response.status === 400) {
//                 const errorData = await response.json();
//                 errorType = `networkError: `;
//             }
//             console.error('API Service Error from unlock router:', errorType);
//             return res.status(response.status).json({ error: errorType });
//         }

//         const contentType = response.headers.get("content-type");
//         if (contentType && contentType.indexOf("application/json") !== -1) {
//             const data = await response.json();
//             return res.json({
//                 status: 'Unlocking is successful',
//                 unlockTime: new Date().toISOString(),
//                 unlocked: true,
//                 stationId: stationId,
//                 slotId: slotId,
//             });
//         } else {
//             return res.status(200).send({
//                 status: 'Unlocking is successful',
//                 unlockTime: new Date().toISOString(),
//                 unlocked: true,
//                 stationId: stationId,
//             });
//         }
//     } catch (error) {
//         console.error('Error with API request:', error);
//         return res.status(500).json({ error: 'networkError' , message : 'Internal Server Error' });
//      }
// };



// Standalone function for programmatic use
async function forceUnlockSlot(stationId, slotId) {
    const targetUrl = `${URL}${stationId}/forceUnlock`;
    const formData = new URLSearchParams({ slotId }).toString();

    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${Buffer.from(API_KEY + ':').toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
    };

    const response = await fetch(targetUrl, options);

    if (!response.ok) {
        let errorType = `HTTP error! Status: ${response.status}`;
        if (response.status === 402) {
            errorType = 'resourceNotFound';
        } else if (response.status === 400) {
            const errorData = await response.json();
            errorType = `networkError: ${errorData.message}`;
        }
        console.error('API Service Error from unlock router:', errorType);
        throw new Error(`Unlocking failed: ${errorType}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        return {
            status: 'Unlocking is successful',
            unlockTime: new Date().toISOString(),
            unlocked: true,
            stationId: stationId,
            slotId: slotId,
            data: data
        };
    } else {
        return {
            status: 'Unlocking is successful',
            unlockTime: new Date().toISOString(),
            unlocked: true,
            stationId: stationId
        };
    }
}

// Express route handler
exports.forUnclockSlotsById = async (req, res) => {
    const { stationId } = req.params;
    const { slotId } = req.body;

    try {
        const result = await forceUnlockSlot(stationId, slotId);
        return res.json(result);
    } catch (error) {
        console.error('Error with API request:', error);
        return res.status(500).json({ error: 'networkError', message: error.message });
    }
};

// Exporting the standalone function for use in other files
exports.forceUnlockSlot = forceUnlockSlot;
