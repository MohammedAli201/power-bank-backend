const express = require('express');
const config = require('../config/config');
const dotenv = require('dotenv');
const multer = require('multer');
const fetch = require('node-fetch');
const router = express.Router();

const URL = "https://openapi.heycharge.global/v1/station/";
const upload = multer();
const API_KEY = process.env.API_KEY_POWER_BANK;

exports.getpowerBankStatusByStationId = async (req, res) => {
    const { method, body, headers, params } = req;
    console.log('API Key:', API_KEY);
    const { stationId } = params;
    const targetUrl = `${URL}${stationId}`;

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
            let errorMessage = `HTTP error! Status: ${response.status}`;
            if (response.status === 402) {
                errorMessage = 'Payment required: Please check your subscription or payment plan.';
            } else if (response.status === 400) {
                const errorData = await response.json();
                errorMessage = `Bad Request: ${errorData.message || response.statusText}`;
            }
            console.error('API Service Error:', errorMessage);
            return res.status(response.status).json({ error: errorMessage });
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

exports.forUnclockSlotsById = async (req, res) => {
    const { params, body } = req;
    const { stationId } = params;
    const apiKey = config.apiKey;
    console.warn('API Key:', apiKey);
    const { slot_id } = body;
    console.log('Slot ID:', slot_id);

    const targetUrl = `${URL}${stationId}/forceUnlock`;

    try {
        const formData = new URLSearchParams(body).toString();

        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        };

        console.log('API Service Request:', targetUrl, options);

        const response = await fetch(targetUrl, options);

        if (!response.ok) {
            let errorMessage = `HTTP error! Status: ${response.status}`;
            if (response.status === 402) {
                errorMessage = 'Payment required: Please check your subscription or payment plan.';
            } else if (response.status === 400) {
                const errorData = await response.json();
                errorMessage = `Bad Request: ${errorData.message || response.statusText}`;
            }
            console.error('API Service Error from unlock router:', errorMessage);
            return res.status(response.status).json({ error: errorMessage });
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();
            return res.json({
                status: 'Unlocking is successful',
                unlockTime: new Date().toISOString(),
                unlocked: true,
                stationId: stationId,
                slotId: slot_id,
            });
        } else {
            return res.status(200).send({
                status: 'Unlocking is successful',
                unlockTime: new Date().toISOString(),
                unlocked: true,
                stationId: stationId,
            });
        }
    } catch (error) {
        console.error('Error with API request:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
