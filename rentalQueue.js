const Queue = require('bull');
const fetch = require('node-fetch');
const Payment = require('./models/paymentModel');

// Initialize Bull queue
const rentalQueue = new Queue('rentalQueue', process.env.REDIS_URL);

// Function to call lock API
const callLockApi = async (rentalId) => {
  try {
    console.log(`Searching for user with phone number: ${rentalId}`);
    // Ensure rentalId is a string
    const phoneNumber = rentalId
    // console.log(typeof(rentalId))
    // await Payment.find({ phoneNumber });
    const userPaymentInfo =  await Payment.find({ phoneNumber }); // or { userPhone: rentalId }
    
    if (!userPaymentInfo) {
      console.log(`No user found with currency number: ${rentalId}`);
      return null;
    }

    console.log(`Lock API called for rental ID ${rentalId}: and the user is ${JSON.stringify(userPaymentInfo)}`);
    return userPaymentInfo;
  } catch (error) {
    console.error(`Error calling lock API for rental ID ${rentalId}:`, error);
    throw error;
  }
};

// Process jobs in the queue
rentalQueue.process(async (job) => {
  const { rentalId } = job.data;
  const result = await callLockApi(rentalId); // Call the lock API when the job is processed
  return result; // Ensure the result is returned
});

module.exports = rentalQueue;
