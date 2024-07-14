const Queue = require('bull');
const Payment = require('./models/paymentModel');
const { getIo } = require('./webSocketServer'); // Ensure this matches the file name

// Initialize Bull queue
const rentalQueue = new Queue('rentalQueue', process.env.REDIS_URL);

console.log('Initializing rentalQueue');

// Function to call lock API
const callLockApi = async (rentalId) => {
  try {
    console.log(`Searching for user with phone number: ${rentalId}`);
    const phoneNumber = rentalId;
    const userPaymentInfo = await Payment.find({ phoneNumber });

    if (!userPaymentInfo || userPaymentInfo.length === 0) {
      console.log(`No user found with phone number: ${rentalId}`);
      return null;
    }

    console.log(`Lock API called for rental ID ${rentalId}:`, JSON.stringify(userPaymentInfo));
    return userPaymentInfo;
  } catch (error) {
    console.error(`Error calling lock API for rental ID ${rentalId}:`, error);
    throw error;
  }
};

// Process jobs in the queue
rentalQueue.process(async (job) => {
  const { rentalId } = job.data;
  console.log(`Processing job for rental ID ${rentalId}`);
  const result = await callLockApi(rentalId);
  console.log(`Job result for rental ID ${rentalId}:`, result);
  return result;
});

rentalQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed successfully`, result);
  const io = getIo(); // Get the initialized io instance
  io.emit('rentalCompleted', { jobId: job.id, result: result });
});

rentalQueue.on('failed', (job, error) => {
  console.error(`Job ${job.id} failed`, error);
  const io = getIo(); // Get the initialized io instance
  io.emit('rentalFailed', { jobId: job.id, error: error.message });
});

module.exports = rentalQueue;
