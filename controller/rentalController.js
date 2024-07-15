const rentalQueue = require('../rentalQueue'); // Import the rental queue
const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer(); // Create HTTP server
const io = new Server(server); // Create socket.io server

const createRental = async (req, res) => {
  const { rentalId, rentalDurationInMilliseconds } = req.body;
  const userId = req.user.id; // Assume you have user identification in req.user

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
      io.to(userId).emit('rentalCompleted', { jobId: job.id, result });
    }).catch((error) => {
      console.error(`Job ${job.id} for user ${userId} failed`, error);
      // Notify the user about the failure
      io.to(userId).emit('rentalFailed', { jobId: job.id, error: error.message });
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create rental',
      error: error.message
    });
  }
};

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId; // Assume user ID is sent as query parameter
  socket.join(userId); // Join room named after user ID
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

module.exports = {
  createRental
};
