const rentalQueue = require('../rentalQueue'); // Import the rental queue
const { getIo } = require('../webSocketServer'); // Ensure correct function name

const createRental = async (req, res, next) => {
  const { rentalId, rentalDurationInMilliseconds } = req.body;
  const userId = req.body.userId || req.user.id; // req.user.id is populated by the temporary user ID middleware

  try {
    console.log(`Creating rental: ${rentalId} ${rentalDurationInMilliseconds}`);
    // Add job to queue when a rental is created
    const job = await rentalQueue.add({
      rentalId: rentalId,
      userId: userId, // Add userId to job data
    }, {
      delay: rentalDurationInMilliseconds, // Delay until the rental expires
      attempts: 1 // Retry calling lock API up to 3 times if it fails
    });

    // Send immediate response
    res.status(201).json({
      message: 'Rental created successfully',
      jobId: job.id // Return the job ID for client-side tracking
    });

    // Listen for job completion
    job.finished().then((result) => {
      console.log(`Job ${job.id} for user ${userId} completed successfully`, result);
      // Notify the user
      const io = getIo();
      io.to(userId).emit('rentalCompleted', { jobId: job.id, result });
    }).catch((error) => {
      console.error(`Job ${job.id} for user ${userId} failed`, error);
      // Notify the user about the failure
      const io = getIo();
      io.to(userId).emit('rentalFailed', { jobId: job.id, error: error.message });
    });
  } catch (error) {
    next(error); // Forward error to global error handler
  }
};

module.exports = {
  createRental
};
