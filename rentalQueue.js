// const Queue = require('bull');
// const Payment = require('./models/paymentModel');
// const { getIo } = require('./webSocketServer'); // Correct function name is getIo

// const rentalQueue = new Queue('rentalQueue', process.env.REDIS_URL);

// console.log('Initializing rentalQueue');

// const callLockApi = async (rentalId) => {
//   try {
//     console.log(`Searching for user with phone number: ${rentalId}`);
//     const phoneNumber = rentalId;
//     const userPaymentInfo = await Payment.find({ phoneNumber });

//     if (!userPaymentInfo || userPaymentInfo.length === 0) {
//       console.log(`No user found with phone number: ${rentalId}`);
//       return null;
//     }

//     console.log(`Lock API called for rental ID ${rentalId}:`, JSON.stringify(userPaymentInfo));
//     return userPaymentInfo;
//   } catch (error) {
//     console.error(`Error calling lock API for rental ID ${rentalId}:`, error);
//     throw error;
//   }
// };

// rentalQueue.process(async (job) => {
//   const { rentalId, userId } = job.data; // Ensure userId is included in job data
//   console.log(`Processing job for rental ID ${rentalId}`);
//   const result = await callLockApi(rentalId);
//   console.log(`Job result for rental ID ${rentalId}:`, result);
//   return { result, userId }; // Return both result and userId
// });

// rentalQueue.on('completed', (job, result) => {
//   const io = getIo(); // Get the initialized io instance
//   const { userId } = job.data; // Get userId from job data
//   console.log(`Job ${job.id} completed successfully`, result);
//   io.to(userId).emit('rentalCompleted', { jobId: job.id, result: result.result });
// });

// rentalQueue.on('failed', (job, error) => {
//   const io = getIo(); // Get the initialized io instance
//   const { userId } = job.data; // Get userId from job data
//   console.error(`Job ${job.id} failed`, error);
//   io.to(userId).emit('rentalFailed', { jobId: job.id, error: error.message });
// });

// module.exports = rentalQueue;


const Queue = require('bull');
const Payment = require('./models/paymentModel');
const { getIo } = require('./webSocketServer'); // Ensure the correct function name is used

const rentalQueue = new Queue('rentalQueue', process.env.REDIS_URL);

console.log('Initializing rentalQueue');

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

rentalQueue.process(async (job) => {
  const { rentalId, userId } = job.data; // Ensure userId is included in job data
  console.log(`Processing job for rental ID ${rentalId}`);
  const result = await callLockApi(rentalId);
  console.log(`Job result for rental ID ${rentalId}:`, result);
  return { result, userId }; // Return both result and userId
});

rentalQueue.on('completed', (job, result) => {
  const io = getIo(); // Get the initialized io instance
  const { userId } = job.data; // Get userId from job data
  console.log(`Job ${job.id} completed successfully`, result);
  io.to(userId).emit('rentalCompleted', { jobId: job.id, result: result.result });
});

rentalQueue.on('failed', (job, error) => {
  const io = getIo(); // Get the initialized io instance
  const { userId } = job.data; // Get userId from job data
  console.error(`Job ${job.id} failed`, error);
  io.to(userId).emit('rentalFailed', { jobId: job.id, error: error.message });
});

module.exports = rentalQueue;
