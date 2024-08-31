const express = require('express');
const config = require('../config/config');
const dotenv = require('dotenv');
const multer = require('multer');
const fetch = require('node-fetch');
const router = express.Router();
const Rent = require('../models/Rent');
dotenv.config();

const URL = "https://openapi.heycharge.global/v1/station/";
const API_KEY = process.env.API_KEY_POWER_BANK;
const upload = multer();

// Helper function for error handling
const handleError = (res, statusCode, message, errorType) => {
    console.error(`${errorType}: ${message}`);
    return res.status(statusCode).json({ error: message, errorType });
};

exports.getReturnPowerBank = async (req, res) => {
    const { stationId } = req.params;
    console.log('stationId:', stationId);

    try {
        const rent = await Rent.findOne({ powerbankId: stationId, status: 'expired' });
        console.log('Rent:', rent);

        if (!rent) {
            return handleError(res, 404, 'Power bank not found', 'resourceNotFound');
        }

        rent.status = "returned";
        rent.lockStatus = 0;
        await rent.save();

        return res.json({ message: "Power bank returned successfully" });
    } catch (error) {
        return handleError(res, 500, 'Internal Server Error', 'serverError');
    }
};

exports.getpowerBankStatusByStationId = async (req, res) => {
    const { stationId } = req.params;
    const targetUrl = `${URL}${stationId}`;
    console.log('Target URL:', targetUrl);

    try {
        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${Buffer.from(API_KEY + ':').toString('base64')}`,
            }
        };

        console.log('API Service Request:', targetUrl, options);

        const response = await fetch(targetUrl, options);

        if (!response.ok) {
            let errorType = 'networkError';
            let errorMessage = `HTTP error! Status: ${response.status}`;

            if (response.status === 402) {
                errorType = 'resourceNotFound';
            } else if (response.status === 400) {
                const errorData = await response.json();
                errorType = 'badRequest';
                errorMessage = `Bad Request: ${errorData.message || response.statusText}`;
            }

            return handleError(res, response.status, errorMessage, errorType);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            return res.json(data);
        } else {
            const responseBody = await response.text();
            res.set('Content-Type', contentType);
            return res.send(responseBody);
        }
    } catch (error) {
        return handleError(res, 500, 'Internal Server Error', 'serverError');
    }
};

exports.forUnclockSlotsById = async (req, res) => {
    const { stationId } = req.params;
    const { slot_id } = req.body;
    const targetUrl = `${URL}${stationId}/forceUnlock`;
    console.log('Target URL:', targetUrl);
    console.log('Slot ID:', slot_id);

    try {
        const formData = new URLSearchParams(req.body).toString();

        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(API_KEY + ':').toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        };

        console.log('API Service Request:', targetUrl, options);

        const response = await fetch(targetUrl, options);

        if (!response.ok) {
            let errorType = 'networkError';
            let errorMessage = `HTTP error! Status: ${response.status}`;

            if (response.status === 402) {
                errorType = 'resourceNotFound';
            } else if (response.status === 400) {
                const errorData = await response.json();
                errorType = 'badRequest';
                errorMessage = `Bad Request: ${errorData.message || response.statusText}`;
            }

            return handleError(res, response.status, errorMessage, errorType);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
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
        return handleError(res, 500, 'Internal Server Error', 'serverError');
    }
};
