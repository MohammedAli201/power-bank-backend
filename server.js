const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = require('./app');

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
