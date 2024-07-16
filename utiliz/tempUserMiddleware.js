// tempUserMiddleware.js
const { v4: uuidv4 } = require('uuid');

const assignTempUserId = (req, res, next) => {
  // Generate a temporary user ID if it does not already exist
  if (!req.user) {
    req.user = {};
  }
  req.user.id = uuidv4();
  next();
};

module.exports = assignTempUserId;
