// const express = require('express');
// const dotenv = require('dotenv');
// const router = express.Router();
// 
// const fetch = require('node-fetch');
// const config = require('../config/config');
// const { unlock } = require('./PaymentRouter');

// const URL = "https://openapi.heycharge.global/v1/station/";
//const multer = require('multer');
// const upload = multer();
// const API_KEY =process.env.API_KEY_POWER_BANK;

// router.all('/powerBankRouter/:stationId/', upload.none(), async (req, res) => {
//     const { method, body, headers, params } = req;
 
//     console.log('API Key:', API_KEY);
//     const { stationId } = params;

//     const targetUrl = `${URL}${stationId}`;
//     // console.log('Proxying request to:', targetUrl);
//     try {
//         // Initialize the fetch options
//         const options = {
//             method,
//             headers: {
//               'Authorization': `Basic ${btoa(API_KEY + ':')}`,
             
//             }
//         };
//         const encodedApiKey = Buffer.from(API_KEY + ':').toString('base64');
//         console.log('Encoded API Key:', encodedApiKey);
//         // Handle FormData or JSON body
//         if (method !== 'GET' && method !== 'HEAD' && body) {
//             if (body instanceof FormData) {
//                 options.body = body; // FormData handles its own content type
//             } else {
//                 options.headers['Content-Type'] = 'application/json';
//                 options.body = JSON.stringify(body); // Assume JSON if not FormData
//             }
//         }

//         console.log('API Service Request:', targetUrl, options);

//         const response = await fetch(targetUrl, options);
//         console.log('API Service Response:', response);

//         if (!response.ok) {
//             let errorMessage = `HTTP error! Status: ${response.status}`;
//             if (response.status === 402) {
//                 errorMessage = 'Payment required: Please check your subscription or payment plan.';
//             } else if (response.status === 400) {
//                 const errorData = await response.json();
//                 errorMessage = `Bad Request: ${errorData.message || response.statusText}`;
//             }
//             console.error('API Service Error:', errorMessage);
//             return res.status(response.status).json({ error: errorMessage });
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
// });

// router.post('/powerBankRouter/:stationId/forceUnlock', upload.none(), async (req, res) => {
//   const { params, body } = req;
//   const { stationId } = params;
//   const apiKey = config.apiKey;
//   console.warn('API Key:', apiKey);
//   const {slot_id} = body;
//   console.log('Slot ID:', slot_id);

//   const targetUrl = `${URL}${stationId}/forceUnlock`;
//   // console.log('Proxying request to:', targetUrl);
//   // console.log('Received body:', body);

//   try {
//     // Convert body to URLSearchParams to handle form-data
//     const formData = new URLSearchParams(body).toString();

//     // Initialize the fetch options
//     const options = {
//       method: 'POST',
//       headers: {
//         'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
//         'Content-Type': 'application/x-www-form-urlencoded', // Use URL-encoded form data
//       },
//       body: formData
//     };

//     console.log('API Service Request:', targetUrl, options);

//     const response = await fetch(targetUrl, options);
    

//     if (!response.ok) {
//       let errorMessage = `HTTP error! Status: ${response.status}`;
//       if (response.status === 402) {
//         errorMessage = 'Payment required: Please check your subscription or payment plan.';
//       } else if (response.status === 400) {
//         const errorData = await response.json();
//         errorMessage = `Bad Request: ${errorData.message || response.statusText}`;
//       }
//       console.error('API Service Error from unlock router:', errorMessage);
//       return res.status(response.status).json({ error: errorMessage });
//     }

//     const contentType = response.headers.get("content-type");
//     if (contentType && contentType.indexOf("application/json") !== -1) {
//       const data = await response.json();
//       return res.json({
//         status: 'Unlocking is successful',
//         unlockTime: new Date().toISOString(),
//         unlocked : true,
//         stationId: stationId,
//         slotId: slot_id,
        
      
//       });
//     } else {
//       // const responseBody = await response.text();
//       // res.set('Content-Type', contentType);
//       return res.status(200).send(
//        {
//         status: 'Unlocking is successful',
//         unlockTime: new Date().toISOString(),
//         unlocked : true,
//         stationId: stationId,
//         // formData: body
//        }


//       );
//     }
//   } catch (error) {
//     console.error('Error with API request:', error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


const express = require('express');
const multer = require('multer');
const upload = multer();
const powerBankController = require('../controller/powerBankController');

const router = express.Router();

router
  .route('/powerBankRouter/:stationId')
  .all(upload.none(), powerBankController.getpowerBankStatusByStationId);

router
  .route('/powerBankRouter/:stationId/forceUnlock')
  .post(upload.none(), powerBankController.forUnclockSlotsById);

module.exports = router;
