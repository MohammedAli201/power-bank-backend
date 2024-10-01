const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const http = require('http');
const { Server } = require("socket.io");

// Import routers
const paymentRouter = require('./router/PaymentRouter');
const globalErrorHandler = require('./controller/ErrorController');
const AppError = require('./utiliz/AppError');
const powerBankRouter = require('./router/PowerBankRouter');
const videoPlayerRouter = require('./router/videoRouter');
const userRouter = require('./router/userRouter');
const rentalRouter = require('./router/rentalRoutes');
const smsRouter = require('./router/smsRoute');

const app = express();
const server = http.createServer(app); // Create HTTP server using Express app
const io = new Server(server, {
    cors: {
        origin: ["https://danabpowerbank.netlify.app/","https://openapi.heycharge.global/v1/station/", "http://localhost:3000/"], // Allow your frontend origin
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    }
});

app.use(mongoSanitize());

// Middleware for logging requests in development environment
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Middleware for parsing JSON bodies
app.use(express.json());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Middleware for handling CORS
const allowedOrigins = ['https://danabpowerbank.netlify.app', 'http://localhost:3000'];
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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
app.set('trust proxy', 1); // Trust the first proxy

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
app.use('/api/v1/rentals', rentalRouter);
app.use('/api/v1/sms', smsRouter);

app.get('/', (req, res) => {
    res.send('Welcome to Danab Power Bank!');
  });
  
// Middleware to handle undefined routes
app.all('*', (req, res, next) => {

    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  
});

// Global error handling middleware
app.use(globalErrorHandler);


// WebSocket connection handling
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId; // Assume user ID is sent as query parameter
    socket.join(userId); // Join room named after user ID
});

module.exports = app;
