const { v4: uuidv4 } = require('uuid');

const assignTempUserId = (req, res, next) => {
  // Generate a temporary user ID if it does not already exist and is not provided in the request body
  if (!req.user) {
    req.user = {};
  }
  req.user.id = req.body.userId || uuidv4();
  console.log('Temporary user ID assigned:', req.user.id);
  next();
};

module.exports = assignTempUserId;
