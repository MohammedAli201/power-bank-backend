const rentalQueue = require('../rentalQueue'); // Import the rental queue
const smsFormatterUtils = require('../utiliz/smsFormatterUtils'); // Import the smsFormatterUtils module
const sendSMS = require('../utiliz/smsUtils');


const createRental = async (req, res) => {
  const { rentalId, rentalDurationInMilliseconds, startTime, endTime } = req.body;

  try {
    console.log(`Creating rental: ${rentalId} ${rentalDurationInMilliseconds}`);

    // Send initial SMS notification
    await sendRentalSMS("createRent", rentalId, startTime, endTime);

    // Add job to queue when a rental is created
    const job = await rentalQueue.add(
      { rentalId: rentalId, userId: req.user.id },
      { delay: rentalDurationInMilliseconds, attempts: 3 }
    );

    // Send immediate response
    res.status(201).json({
      message: 'Rental created successfully',
      jobId: job.id,
      userId: req.user.id
    });

    // Listen for job completion
    job.finished().then(async (result) => {
      await sendRentalSMS("completedRent", rentalId, startTime, endTime);
      console.log(`Job ${job.id} completed successfully, result:`, result);
    }).catch((error) => {
      console.error(`Job ${job.id} failed, error:`, error);
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create rental',
      error: error.message
    });
  }
};

// Utility function to send rental SMS
const sendRentalSMS = async (type, rentalId, startTime, endTime) => {
  const smsfrm = smsFormatterUtils.formatRentalSMS(type, rentalId, startTime, endTime);
  const smsResponse = await sendSMS(smsfrm.formattedPhone, smsfrm.message);
  console.log(`SMS Response for ${type}:`, smsResponse);
};

module.exports = {
  createRental
};