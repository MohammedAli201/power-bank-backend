const express = require('express');
const app = express();
const cors = require('cors');
const paymentRouter = require('./router/PaymentRouter');
const powerBankRouter = require('./router/powerBankRouter');

// Middleware to log request time
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
// Route setup for power bank-related endpoints
app.use('/api/v1/stations', powerBankRouter);

// Route setup for payment-related endpoints
app.use('/api/v1/stations/payments', paymentRouter);
// app.use('/api/v1/stations/evc_paymentRequest', paymentRouter);

// 404 Not Found middleware for undefined routes
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Not Found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Logs error stack trace for debugging
    res.status(500).json({
        status: 'error',
        message: err.message
    });
});

module.exports = app;
