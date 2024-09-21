const rentalQueue = require('../rentalQueue'); // Import the rental queue
const { getIo } = require('../webSocketServer'); // Ensure correct function name



const createRental = async (req, res) => {
  const { rentalId, rentalDurationInMilliseconds } = req.body;

  try {
    console.log(`Creating rental: ${rentalId} ${rentalDurationInMilliseconds}`);
    // Add job to queue when a rental is created
    const job = await rentalQueue.add({
      rentalId: rentalId,
      userId: req.user.id // Add userId to job data
    }, {
      delay: rentalDurationInMilliseconds, // Delay until the rental expires
      attempts: 1 // Retry calling lock API up to 3 times if it fails
    });

    // Send immediate response
    res.status(201).json({
      message: 'Rental created successfully',
      jobId: job.id, // Return the job ID for client-side tracking,
      userId: req.user.id // Return the user ID for client-side tracking
    });

    // Listen for job completion
    job.finished().then((result) => {
      console.warn(`Job ${job.id} completed successfully, result:`, result);

    }).catch((error) => {
      console.warn(`Job ${job.id} failed, error:`, error);
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create rental',
      error: error.message
    });
  }
};

module.exports = {
  createRental
};
