const Queue = require('bull');
const Payment = require('./models/paymentModel');
const { getIo } = require('./webSocketServer');
const moment = require('moment-timezone');
const Rent = require('./models/Rent');
const rentalQueue = new Queue('rentalQueue', process.env.REDIS_URL);

console.log('Initializing rentalQueue');

const callLockApi = async (rentalId) => {
  try {
    console.log(`Searching for user with phone number: ${rentalId}`);
    const phoneNumber = rentalId;

    // Get the current date and time in the Africa/Mogadishu time zone
    const currentDateTime = moment().tz("Africa/Mogadishu");
    const currentTimeMS = currentDateTime.valueOf();
    console.log("Mogadishu Time (ISO 8601):", currentDateTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'));
    console.log("Current Time (ms):", currentTimeMS);

    // Fetch the payment records based on phone number, active status, and lock status
    const paymentInfo = await Payment.find({
      phoneNumber,
      paymentStatus: 'active',
      lockStatus: 1,
      term_and_conditions: true
    });
    console.log("Payment Info:", paymentInfo);

    if (paymentInfo.length === 0) {
      console.log("No active payments found for this phone number with the end time reached or almost reached and lock status of 1");
      return null;
    }

    let updatedPayments = [];
    let updatedRents = [];

    // Loop through each payment and update the status if the end time has been reached
    for (let payment of paymentInfo) {
      if (!payment.endRentTime) {
        console.error(`Payment ID ${payment._id} does not have an endRentTime.`);
        continue; // Skip payments with missing endRentTime
      }

      const paymentEndTime = moment(payment.endRentTime);
      const paymentEndTimeMS = paymentEndTime.valueOf();

      console.log("Payment End Time (ISO 8601):", paymentEndTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'));
      console.log("Payment End Time (ms):", paymentEndTimeMS);
      console.log("Current Time (ms):", currentTimeMS);

      if (paymentEndTimeMS <= currentTimeMS) {
        console.log("The payment end time has been reached for payment ID:", payment._id);

        // Update the payment status and lock status
        payment.paymentStatus = 'inactive';
        payment.term_and_conditions = true;
        payment.lockStatus = 0;
        await payment.save();
        updatedPayments.push(payment);

        // Also update the associated rent status to inactive
        const rent = await Rent.findOne({ phoneNumber, paymentId: payment._id, status: 'active' });
        if (!rent) {
          console.error(`No active rent found for payment ID ${payment._id}.`);
          continue; // Skip if no rent is found
        }

        console.log("Found active rent for payment ID:", payment._id);
        rent.status = 'expired';
        await rent.save();
        updatedRents.push(rent);
      }
    }

    return {
      message: 'Payments and rents updated successfully',
      updatedPayments,
      updatedRents,
    };
  } catch (error) {
    console.error('Error in callLockApi:', error);
    throw new Error(`An error occurred while processing the request: ${error.message}`);
  }
};

// Define the process handler only once and include the options for removing jobs
rentalQueue.process(async (job) => {
  const { rentalId, userId } = job.data;
  console.log(`Processing job for rental ID ${rentalId}`);
  const result = await callLockApi(rentalId);
  console.log(`Job result for rental ID ${rentalId}:`, result);
  return { result, userId };
});

// Automatically remove completed and failed jobs
rentalQueue.on('completed', (job, result) => {
  const io = getIo();
  const { userId } = job.data;

  if (userId) {
    io.emit('rentalCompleted', { jobId: job.id, result: result.result, userId: userId });
    console.log(`Emitting rentalCompleted event to user ${userId}`);
  } else {
    console.error(`Job ${job.id} completed but no userId found in job data`);
  }
});

rentalQueue.on('failed', (job, error) => {
  const io = getIo();
  const { userId } = job.data;
  console.error(`Job ${job.id} failed`, error);
  if (userId) {
    io.emit('rentalFailed', { jobId: job.id, error: error.message, userId: userId });
  } else {
    console.error(`Job ${job.id} failed but no userId found in job data`);
  }
});

module.exports = rentalQueue;
