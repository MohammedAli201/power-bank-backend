const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const config = require('../config/config');
const FormData = require('form-data');

const dotenv = require('dotenv');// dotenv.config({ path: './config.env' });
dotenv.config({ path: './env' });
const URL = "https://openapi.heycharge.global/v1/station/setScreenInfo";
const API_KEY = process.env.apiKey;

exports.uploadVideo = async (req, res) => {
    const { imei } = req.body;
    console.log('IMEI:', imei);

    if (!imei) {
        return res.status(400).json({ error: 'IMEI is required' });
    }

    if (!req.file) {
        return res.status(400).json({ error: 'No video file uploaded' });
    }

    const videoPath = path.join(__dirname, '../uploads', req.file.filename);

    try {
        const videoData = fs.readFileSync(videoPath);

        const formData = new FormData();
        formData.append('imei', imei);
        formData.append('video', videoData, {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });

        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(API_KEY + ':').toString('base64')}`,
                ...formData.getHeaders()
            },
            body: formData
        };

        const response = await fetch(URL, options);
        console.log('API Service Response:', response);

        if (!response.ok) {
            let errorMessage = `HTTP error! Status: ${response.status}`;
            if (response.status === 402) {
                errorMessage = 'Payment required: Please check your subscription or payment plan.';
            } else if (response.status === 400 || response.code === 400 || response.status(400)) {
                const errorData = await response.json();
                errorMessage = `Bad Request: ${errorData.message || response.statusText}`;
            }
            console.error('API Service Error:', errorMessage);
            return res.status(response.status).json({ error: errorMessage });
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();
            return res.json({
                status: 'Play video is successful',
                timePlay: new Date().toISOString(),
                play: true,
                imei: imei,
            });
        } else {
            return res.status(200).send({
                status: 'Operation is successful',
                time: new Date().toISOString(),
                success: true,
                imei: imei,
                res: response
            });
        }
    } catch (error) {
        console.error('Error with API request:', error.message || error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        fs.unlinkSync(videoPath); // Clean up the uploaded file from the server
    }
};
