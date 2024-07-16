// const express = require('express');
// const rentalController = require('../controller/rentalController');

// const router = express.Router();

// // Define a route to create a rental
// router.post('/', rentalController.createRental);

// module.exports = router;
const express = require('express');
const rentalController = require('../controller/rentalController');
const assignTempUserId = require('../utiliz/tempUserMiddleware');

const router = express.Router();

// Apply the temporary user ID middleware
router.post('/', assignTempUserId, rentalController.createRental);

module.exports = router;
