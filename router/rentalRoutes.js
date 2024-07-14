const express = require('express');
const rentalController = require('../controller/rentalController');

const router = express.Router();

// Define a route to create a rental
router.post('/', rentalController.createRental);

module.exports = router;
