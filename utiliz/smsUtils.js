require('dotenv').config();

const fetch = require('node-fetch');
const qs = require('qs');


const baseURL = 'https://smsapi.hormuud.com/';
// const password = process.env.SMS_PASSWORD; // Securely managed through environment variables
const username = process.env.SMS_USERNAME; // Securely managed through environment variables
// const password = process.env.SMS_PASSWORD; // Securely managed through environment variables
const SMS_API_KEY = process.env.SMS_API_KEY;

async function sendSMS(mobile, message, senderid) {
    try {
       


        const tokenBody = qs.stringify({
            grant_type: "password",
            username: username,
            password: SMS_API_KEY
        });

        const tokenResponse = await fetch(`${baseURL}token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'API-Key': SMS_API_KEY
            },
            body: tokenBody
        });

        const tokenData = await tokenResponse.json();
        console.log('Token Data:', tokenData); // Log the token data
        if (!tokenResponse.ok) {
            console.error('Failed to fetch token:', tokenData.error_description);
            throw new Error(`Authentication failed: ${tokenData.error_description}`);
        }

        const accessToken = tokenData.access_token;

        const smsResponse = await fetch(`${baseURL}api/Outbound/SendSMS`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                mobile: mobile,
                message: message,
                senderid:  'Danab Power Bank'
            })
        });

        const smsData = await smsResponse.json();
        if (!smsResponse.ok) {
            console.error('Failed to send SMS:', smsData.error_description);
            throw new Error(`SMS sending failed: ${smsData.error_description}`);
        }

        return smsData; // Return the response data
    } catch (error) {
        console.error('Unexpected error:', error.message);
        throw new Error(error.message);
    }
}


module.exports = sendSMS;