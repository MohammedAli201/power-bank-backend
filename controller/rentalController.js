const rentalQueue = require('../rentalQueue'); // Import the rental queue
const smsFormatterUtils = require('../utiliz/smsFormatterUtils'); // Import the smsFormatterUtils module
const sendSMS = require('../utiliz/smsUtils');


const createRental = async (req, res) => {
  const { rentalId, rentalDurationInMilliseconds, formattedStartTime, formattedEndTime } = req.body;

  try {
    console.log(`Creating rental: ${rentalId} ${rentalDurationInMilliseconds}`);
    // Send initial SMS notification
    const phoneNumber = rentalId;
   const respsms =  await sendRentalSMS("createRent", phoneNumber, formattedStartTime, formattedEndTime);
    console.log(`SMS Response for createRent:`, respsms);
    // Add job to queue when a rental is created
    const job = await rentalQueue.add(
      { rentalId: rentalId, userId: req.user.id },
      { delay: rentalDurationInMilliseconds, attempts: 3 }
    );

    // Send immediate response
    res.status(201).json({
      message: 'Rental created successfully',
      jobId: job.id,
      userId: req.user.id,
      

    });

    // Listen for job completion
    job.finished().then(async (result) => {

      await sendRentalSMS("completedRent", phoneNumber, formattedStartTime, formattedEndTime);
      console.log(`Job ${job.id} completed successfully, result:`, result);
      // remove the job from the queue

  
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

const sendRentalSMS = async (type, phoneNumber, formattedStartTime, formattedEndTime) => {

  // const smsfrm = smsFormatterUtils(type, phoneNumber, formattedStartTime, formattedEndTime);

  const smsfrm = smsFormatterUtils({
    type,
    phoneNumber,
    startTime: formattedStartTime,
    endTime: formattedEndTime,
  });
  const mobile = smsfrm.formattedPhone;
  const message = smsfrm.message;
  const senderid = 'Danab Power Bank';
  const smsResponse = await sendSMS(mobile, message, senderid);
 // const smsResponse = await sendSMS({mobile:smsfrm.formattedPhone, message:smsfrm.message, senderid:"Danab Power Bank"});
  console.log(`SMS Response for ${type}:`, smsResponse);
};

module.exports = {
  createRental
};