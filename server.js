
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const rentalQueue = require('./rentalQueue'); // Import the rental queue to ensure it starts processing jobs

// Load environment variables from .env file
dotenv.config();

const app = require('./app');

// Handle uncaught exceptions
process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Replace placeholder with actual password in the database URI
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// Mongoose connection setup with increased timeout settings
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  serverSelectionTimeoutMS: 5000, // Default is 30000 (30 seconds)
  socketTimeoutMS: 45000, // Default is 360000 (6 minutes)
  connectTimeoutMS: 30000, // Default is 30000 (30 seconds)
}).then(() => {
  console.log('Connected to the database');
}).catch((error) => {
  console.error('Error connecting to the database', error);
});

// Listen for incoming requests
const port = process.env.PORT || 9000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM signal for graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
