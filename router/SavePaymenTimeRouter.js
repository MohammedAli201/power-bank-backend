const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

const upload = multer(); 

// Handle API requests to /api/v1/stations/savePaymentInfo
router.post('/', upload.none(), async (req, res) => {
    const { body } = req;
    console.log(body);

    // Mock config for demonstration, replace with actual config import if needed
    const config = { apiKey: 'your-api-key' };
    const apiKey = config.apiKey;

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 1 * 60 * 60 * 1000);
     // 1 hour from startTime
  // Save the payment information to the txt file
  body.startTime = startTime;
    body.endTime = endTime;
    
    fs.appendFile('payment-info.txt', JSON.stringify(body), (err) => {
        if (err) {
            console.error('Error saving payment information:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    return res.status(200).json({ 
        body,
        endTime,
        message: 'Payment Information Saved Successfully!',
    });
});

module.exports = router;
