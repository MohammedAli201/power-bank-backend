// const dotenv = require('dotenv');
// dotenv.config();

// const ApiKey = process.env.PRIVATE_KEY;

// const privateRoute = (req, res, next) => {
//     req.headers['apikey'] || req.headers['ApiKey'] 
//      if (!authorization || authorization !== ApiKey) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }
//   next();
// };

const dotenv = require('dotenv');
dotenv.config();

const requiredAPI = process.env.PRIVATE_KEY;

const privateRoute = (req, res, next) => {
  const apiKey =  req.headers['apikey']; // Check both possible headers
  
  // Logging the headers for debugging
  console.log('Headers received:', req.headers);
  console.log('API Key:', apiKey);  
  
  if (!apiKey || apiKey !== requiredAPI) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

module.exports = privateRoute;
