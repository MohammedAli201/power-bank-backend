// Import necessary modules
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

// Import routers
const paymentRouter = require('./router/PaymentRouter');
const powerBankRouter = require('./router/PowerBankRouter');
const videoPlayerRouter = require('./router/videoRouter');
const userRouter = require('./router/userRouter');

const app = express();

// Middleware for logging requests in development environment
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Middleware for parsing JSON bodies
app.use(express.json());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Middleware for handling CORS
app.use(cors());
app.options('*', cors());

// Middleware for compressing responses
app.use(compression());

// Middleware for setting security HTTP headers
app.use(helmet());

// Middleware for enabling rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per window
    standardHeaders: true, // Use standard headers
    legacyHeaders: false // Disable legacy headers
});
app.use('/api', limiter);

// Middleware for handling cookies
app.use(cookieParser());

// Set trust proxy configuration (choose one option)

// Option 1: Configure trust proxy properly
app.set('trust proxy', 1); // Trust the first proxy

// Option 2: Disable trust proxy if not needed
// app.disable('trust proxy');

// Middleware to log the request time
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// Route handlers
app.use('/api/v1/stations', powerBankRouter);
app.use('/api/v1/stations/payments', paymentRouter);
app.use('/api/v1/stations/video', videoPlayerRouter);
app.use('/api/v1/users', userRouter);

// Middleware to handle undefined routes
app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`
    });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Logs error stack trace for debugging
    res.status(500).json({
        status: 'error',
        message: err.message
    });
});

// Export the Express application
module.exports = app;
