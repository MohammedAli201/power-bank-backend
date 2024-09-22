require('dotenv').config();

const fetch = require('node-fetch');
const qs = require('qs');


const baseURL = 'https://smsapi.hormuud.com/';
// const password = process.env.SMS_PASSWORD; // Securely managed through environment variables
const username = process.env.SMS_USERNAME; // Securely managed through environment variables
// const password = process.env.SMS_PASSWORD; // Securely managed through environment variables
const SMS_API_KEY = process.env.SMS_API_KEY;

async function sendSMS (mobile, message, senderid) {

    try {
        console.log('Received request to send SMS for mobile:', req.body.mobile); // Safe logging

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
        console.log('Token response:', tokenResponse)
        const tokenData = await tokenResponse.json();
        if (!tokenResponse.ok) {
            console.error('Failed to fetch token:', tokenData.error_description);
            return res.status(tokenResponse.status).json({ error: 'Authentication failed.', details: tokenData });
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
                senderid: senderid || 'Danab Power Bank'
            })
        });

        const smsData = await smsResponse.json();
        if (!smsResponse.ok) {
            console.error('Failed to send SMS:', smsData.error_description);
            return res.status(smsResponse.status).json({ error: 'SMS sending failed.', details: smsData });
        }

        res.json(smsData);
    } catch (error) {
        console.error('Unexpected error:', error.message);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
  
}

module.exports = { sendSMS };
