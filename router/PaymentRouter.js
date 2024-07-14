const express = require('express');
const paymentController = require('../controller/paymentController');

const router = express.Router();

router
  .route('/evc_paymentRequest')
  .post(paymentController.evc_paymentRequest);

router
  .route('/cancelPayment')
  .post(paymentController.cancelPayment);

  router
  .route('/savePaymentInfoWithUserInfo')
  .post(paymentController.savePaymentInfoWithUserInfo)

  router
  .route('/findbyPhone/:phoneNumber')
  .get(paymentController.findByPhoneNumber)

  router
  .route('/updatePaymentStatus/:phoneNumber')
  .patch(paymentController.updatePaymentStatus);
module.exports = router;
