const express = require('express');
const app = express();
const cors = require('cors');
const paymentRouter = require('./router/paymentRouter');
const powerBankRouter = require('./router/powerBankRouter');
const videoPlayerRouter = require('./router/videoRouter');
const userRouter = require('./router/userRouter');
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
app.use('/api/v1/stations/video', videoPlayerRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`
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
