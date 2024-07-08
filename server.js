const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const app = require('./app');
console.log(process.env.DATABASE_PASSWORD);
console.log(process.env.DATABASE);
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});