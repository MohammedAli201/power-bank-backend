// router/paymentRouter.js
const express = require('express');
const paymentController = require('../controller/paymentController');

const router = express.Router();

router
  .route('/')
  .post(paymentController.createPayment); // Correct reference to createPayment

router
  .route('/ForceUnlock/:id')
  .post(paymentController.unlock); // Correct reference to unlock

  router
  .route('/evc_paymentRequest')
  .post(paymentController.evc_paymentRequest); // Correct reference to unlock
module.exports = router;
