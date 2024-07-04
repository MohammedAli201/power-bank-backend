const express = require('express');
const paymentController = require('../controller/paymentController');

const router = express.Router();

router
  .route('/evc_paymentRequest')
  .post(paymentController.evc_paymentRequest);

router
  .route('/cancelPayment')
  .post(paymentController.cancelPayment);

module.exports = router;
