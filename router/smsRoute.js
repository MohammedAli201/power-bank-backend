const express = require('express');
const multer = require('multer');
const upload = multer();
const smsController = require('../controller/smsController');

const router = express.Router();

router
  .route('/SendNotification')
  .all(upload.none(), smsController.SendNotification);



module.exports = router;
