const rentalQueue = require('../rentalQueue'); // Import the rental queue
const smsFormatterUtils = require('../utiliz/smsFormatterUtils'); // Import the smsFormatterUtils module
const sendSMS = require('../utiliz/smsUtils'); // Import SMS utility

const createRental = async (req, res) => {
  const { rentalId, rentalDurationInMilliseconds, formattedStartTime, formattedEndTime } = req.body;

  try {
    console.log(`Creating rental: ${rentalId} for duration: ${rentalDurationInMilliseconds} ms`);

    // Add job to queue with rental details
    const job = await rentalQueue.add(
      { rentalId: rentalId, userId: req.user.id }, // Job data
      { delay: rentalDurationInMilliseconds, attempts: 3 } // Job options
    );

    // Send immediate response after job is added to the queue
    res.status(201).json({
      message: 'Rental created successfully',
      jobId: job.id,
      userId: req.user.id,
    });

    // Now handle the async tasks (SMS and job completion) in the background without blocking response

    // Send initial SMS notification
    const phoneNumber = rentalId; // assuming rentalId represents the phone number
    try {
      const respsms = await sendRentalSMS("createRent", phoneNumber, formattedStartTime, formattedEndTime);
      console.log(`Initial SMS sent successfully for rental creation:`, respsms);
    } catch (smsError) {
      console.error('Failed to send initial SMS:', smsError);
    }

    // Listen for job completion or failure
    job.finished()
      .then(async (result) => {
        console.log(`Job ${job.id} completed successfully, result:`, result);
        
        // Send rental completion SMS after the job is finished
        try {
          await sendRentalSMS("completedRent", phoneNumber, formattedStartTime, formattedEndTime);
          console.log(`Completion SMS sent successfully for job ${job.id}`);
        } catch (smsError) {
          console.error(`Failed to send completion SMS for job ${job.id}:`, smsError);
        }

        // Optionally, you can remove the job from the queue here if necessary
        await job.remove();
        console.log(`Job ${job.id} removed from the queue after completion.`);
      })
      .catch((error) => {
        console.error(`Job ${job.id} failed, error:`, error);
      });
    
  } catch (error) {
    console.error('Error in creating rental:', error);
    res.status(500).json({
      message: 'Failed to create rental',
      error: error.message
    });
  }
};

// Utility function to send rental-related SMS
const sendRentalSMS = async (type, phoneNumber, formattedStartTime, formattedEndTime) => {
  try {
    // Format the SMS message based on the type (e.g., createRent, completedRent)
    const smsfrm = smsFormatterUtils({
      type,
      phoneNumber,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    });

    // Extract relevant information from the formatted SMS object
    const mobile = smsfrm.formattedPhone;
    const message = smsfrm.message;
    const senderid = 'Danab Power Bank';

    // Send the SMS using the sendSMS utility
    const smsResponse = await sendSMS(mobile, message, senderid);
    console.log(`SMS Response for ${type}:`, smsResponse);
    return smsResponse;
  } catch (error) {
    console.error(`Failed to send SMS for ${type}:`, error);
    throw error; // Re-throw error to handle it where the function is called
  }
};

module.exports = {
  createRental
};
