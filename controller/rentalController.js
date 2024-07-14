const rentalQueue = require('../rentalQueue'); // Import the rental queue

const createRental = async (req, res) => {
  const { rentalId, rentalDurationInMilliseconds } = req.body;

  try {
    // Add job to queue when a rental is created
    const job = await rentalQueue.add({
      rentalId: rentalId,
    }, {
      delay: rentalDurationInMilliseconds, // Delay until the rental expires
      attempts: 3 // Retry calling lock API up to 3 times if it fails
    });

    // Listen for job completion
    job.finished().then((result) => {
      res.status(201).json({
        message: 'Rental created successfully',
        result: result // Return the result from the lock API
      });
    }).catch((error) => {
      res.status(500).json({
        message: 'Rental created, but failed to call lock API',
        error: error.message
      });
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
