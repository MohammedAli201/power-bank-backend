// const express = require('express');
// const multer = require('multer');
// const AuthController = require('../controller/AuthController');
// const videoPlayerController = require('../controller/videoPlayerController');

// const router = express.Router();
// const upload = multer({ dest: 'uploads/' });

// // Protect and upload video route
// router.post('/upload', upload.single('video'), AuthController.protect, videoPlayerController.uploadVideo);

// module.exports = router;
const express = require('express');
const multer = require('multer');
const AuthController = require('../controller/AuthController');
const videoPlayerController = require('../controller/videoPlayerController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('video'), AuthController.protect, videoPlayerController.uploadVideo);

module.exports = router;