const express = require('express');
const config = require('../config/config');
exports.router = express.Router();
exports.getpowerBankStatusByStationId =  (req, res) => {
    const ime = req.params.ime;
    res.status(200).json({message: 'Hello from getpowerBankStatusByStationId!',
       ime: ime,
    apikey: config.apiKey});
}

exports.UnlockSlotsById =  (req, res) => {
    const id = req.params.id;
    req.params.time = new Date();
    console.log(id);
    res.send('Hello from UnlockSlotsById!');
}

exports.LockSlotsById =  (req, res) => {
    res.send('Hello from LockSlotsById!');
}
