require('dotenv').config();

module.exports = {
  apiKey: process.env.API_KEY_POWER_BANK, // Correct the typo in the key
  DATABASE: process.env.DATABASE,         // Correct the typo in the key
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  MERCHAT_ID: process.env.MERCHANTUID,
  APIUSERID: process.env.APIUSERID,
  API_KEY: process.env.API_KEY,
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION


};
