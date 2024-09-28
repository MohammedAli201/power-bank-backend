
const fetch = require('node-fetch');
const qs = require('qs');
const smsFormatterUtils = require('../utiliz/smsFormatterUtils');
const sendSMS = require('../utiliz/smsUtils');

// const baseURL = 'https://smsapi.hormuud.com/';
// const username = process.env.SMS_USERNAME; // Securely managed through environment variables
// // const password = process.env.SMS_PASSWORD; // Securely managed through environment variables
// const SMS_API_KEY = process.env.SMS_API_KEY;

                
exports.SendNotification = async (req, res) => {

    try {
        const { rentalId, formattedStartTime, formattedEndTime } = req.body;
        console.log('Rental ID:', rentalId);
        console.log('Start Time:', formattedStartTime);
        console.log('End Time:', formattedEndTime);
        
        
  const smsfrm =  smsFormatterUtils({
    type:"createRent",
    phoneNumber:rentalId,
    startTime: formattedStartTime,
    endTime: formattedEndTime,
  });
 console.log('smsfrm here:', smsfrm.formattedPhone);
 const mobile = smsfrm.formattedPhone;
    const message = smsfrm.message;
    const senderid = 'Danab Power Bank';
  const smsResponse = await sendSMS(mobile, message, senderid);
//console.log(smsResponse)

       // const smsResponse = await sendSMS(mobile, message, senderid);
        console.log('SMS Response:', smsResponse);
        res.status(200).json({ message: 'SMS sent successfully', details: smsResponse
        });

        
    } catch (error) {
        console.error('Error during sendSMS API call:', error);
        res.status(500).json({ message: 'Request failed', error: error.message });
        
    }
   
};
