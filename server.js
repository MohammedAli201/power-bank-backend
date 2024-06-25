const mongoose = require('mongoose');
const dotenv = require('dotenv');
require('dotenv').config(); 
// dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
console.log(DB);
mongoose
  .connect(DB, {
    
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});