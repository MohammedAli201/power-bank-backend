const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = require('./app');
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Debugging: Print out the environment variables
console.log("Database Password: ", process.env.DATABASE_PASSWORD);
console.log("Database URI: ", process.env.DATABASE);

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// Mongoose connection setup
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true, // Ensure SSL is enabled
    tlsAllowInvalidCertificates: true, // For testing purposes
    serverSelectionTimeoutMS: 5000, // Increase timeout settings
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000
  })
  .then(() => console.log('DB connection successful!'))
  .catch((err) => {
    console.error('DB connection error:', err.message);
    console.error('Full error details:', err);
  });

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});