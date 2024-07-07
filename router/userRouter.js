const express = require('express');

const router = express.Router();
const multer = require('multer');

const AuthController = require('../controller/AuthController');

router.route('/singup').post(AuthController.SingUp);

router.route('/login').post(AuthController.login);

module.exports = router;