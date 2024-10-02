
const fetch = require('node-fetch');
const qs = require('qs');
const smsFormatterUtils = require('../utiliz/smsFormatterUtils');
const sendSMS = require('../utiliz/smsUtils');

// const baseURL = 'https://smsapi.hormuud.com/';
// const username = process.env.SMS_USERNAME; // Securely managed through environment variables
// // const password = process.env.SMS_PASSWORD; // Securely managed through environment variables
// const SMS_API_KEY = process.env.SMS_API_KEY;

// const catchAsync = fn => (req, res, next) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch(next);
//   }
// }
                
// exports.SendNotification = async (req, res) => {

//   if (!req.body.rentalId || !req.body.formattedStartTime || !req.body.formattedEndTime) {
//       if (!req.body.mobile || !req.body.message || !req.body.senderid) {
//         const smsResponse = await sendSMS(req.body.mobile, req.body.message, "Danab Power Bank");
//         return res.status(200).json({ message: 'SMS sent successfully', details: smsResponse  });
//     }
//   }

//     try {
//         const { rentalId, formattedStartTime, formattedEndTime } = req.body;
//         console.log('Rental ID:', rentalId);
//         console.log('Start Time:', formattedStartTime);
//         console.log('End Time:', formattedEndTime);
        
        
//   const smsfrm =  smsFormatterUtils({
//     type:"createRent",
//     phoneNumber:rentalId,
//     startTime: formattedStartTime,
//     endTime: formattedEndTime,
//   });
//  console.log('smsfrm here:', smsfrm.formattedPhone);
//  const mobile = smsfrm.formattedPhone;
//     const message = smsfrm.message;
//     const senderid = 'Danab Power Bank';
//   const smsResponse = await sendSMS(mobile, message, senderid);
// //console.log(smsResponse)

//        // const smsResponse = await sendSMS(mobile, message, senderid);
//         console.log('SMS Response:', smsResponse);
//         res.status(200).json({ message: 'SMS sent successfully', details: smsResponse
//         });

        
//     } catch (error) {
//         console.error('Error during sendSMS API call:', error);
//         res.status(500).json({ message: 'Request failed', error: error.message });
        
//     }
   
// };


const catchAsync = fn => (req, res, next) => {
  return fn(req, res, next).catch(next);
};

exports.SendNotification = catchAsync(async (req, res) => {

  if (!req.body.rentalId || !req.body.formattedStartTime || !req.body.formattedEndTime) {
    if (!req.body.mobile || !req.body.message || !req.body.senderid) {
      const smsResponse = await sendSMS(req.body.mobile, req.body.message, "Danab Power Bank");
      return res.status(200).json({ message: 'SMS sent successfully', details: smsResponse });
    }
  }

  const { rentalId, formattedStartTime, formattedEndTime } = req.body;
  console.log('Rental ID:', rentalId);
  console.log('Start Time:', formattedStartTime);
  console.log('End Time:', formattedEndTime);

  const smsfrm = smsFormatterUtils({
    type: "createRent",
    phoneNumber: rentalId,
    startTime: formattedStartTime,
    endTime: formattedEndTime,
  });

  console.log('smsfrm here:', smsfrm.formattedPhone);
  const mobile = smsfrm.formattedPhone;
  const message = smsfrm.message;
  const senderid = 'Danab Power Bank';

  const smsResponse = await sendSMS(mobile, message, senderid);
  console.log('SMS Response:', smsResponse);
  
  res.status(200).json({ message: 'SMS sent successfully', details: smsResponse });
});
