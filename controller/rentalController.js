const rentalQueue = require('../rentalQueue'); // Import the rental queue

const createRental = async (req, res) => {
  const { rentalId, rentalDurationInMilliseconds } = req.body;

  try {
    console.log(`Creating rental: ${rentalId} ${rentalDurationInMilliseconds}`);
    // Add job to queue when a rental is created
    const job = await rentalQueue.add({
      rentalId: rentalId,
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
      console.log(`Job ${job.id} completed successfully`, result);
    }).catch((error) => {
      console.error(`Job ${job.id} failed`, error);
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
