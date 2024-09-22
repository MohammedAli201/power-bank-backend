const Queue = require('bull');
const Payment = require('./models/paymentModel');
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

    // Fetch the rent record based on phone number and active status
    const rent = await Rent.findOne({
      phoneNumber,
      status: { $in: ['active', 'expired'] } // Only look for active or expired rents
    });

    if (!rent) {
      console.log("No active or expired rents found for this phone number.");
      return { message: "No active or expired rents found for this phone number." };
    }

    // Check if the rent status is already 'completed' or 'returned'
    if (rent.status === 'completed' || rent.status === 'returned') {
      console.log(`The rental has already been completed or returned for rental ID: ${rent._id}`);
      return { message: "Rental already completed or returned." };
    }

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
      return { message: "No active payments found." };
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

        // Also update the associated rent status to 'expired'
        if (rent.status !== 'completed' ||  rent.status !== 'returned') {
          rent.status = 'expired';
          await rent.save();
          updatedRents.push(rent);
        }
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

rentalQueue.process(async (job) => {
  const { rentalId, userId } = job.data;
  console.log(`Processing job for rental ID ${rentalId}`);

  // Call function to handle regular rental expiration
  const result = await callLockApi(rentalId);

  console.log(`Job result for rental ID ${rentalId}:`, result);
  return { result, userId };
});

rentalQueue.on('completed', async (job, result) => {
  console.log(`Job ${job.id} completed with result:`, result.result);

  const { userId } = job.data;
  if (userId) {
    try {
      // Optionally send an SMS notification to the user
      console.log(`Sending SMS for user ${userId}`);
    } catch (error) {
      console.error(`Failed to send SMS for user ${userId}:`, error);
    }
  } else {
    console.error(`Job ${job.id} completed but no userId found in job data`);
  }
});

rentalQueue.on('failed', async (job, error) => {
  const { userId } = job.data;
  console.error(`Job ${job.id} failed with error:`, error);

  if (userId) {
    try {
      // Optionally send a failure notification SMS
      console.log(`Sending failure SMS for user ${userId}`);
    } catch (smsError) {
      console.error(`Failed to send failure SMS for user ${userId}:`, smsError);
    }
  }
});

module.exports = rentalQueue;
