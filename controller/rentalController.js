// // const rentalQueue = require('../rentalQueue'); // Import the rental queue
// // const { getIo } = require('../webSocketServer'); // Ensure correct function name

// // const createRental = async (req, res, next) => {
// //   const { rentalId, rentalDurationInMilliseconds } = req.body;
// //   const userId = req.body.userId || req.user.id; // req.user.id is populated by the temporary user ID middleware

// //   try {
// //     console.log(`Creating rental: ${rentalId} ${rentalDurationInMilliseconds}`);
// //     // Add job to queue when a rental is created
    
// //     const job = await rentalQueue.add({
// //       rentalId: rentalId,
// //       userId: userId, // Add userId to job data
// //     }, {
// //       delay: rentalDurationInMilliseconds, // Delay until the rental expires
// //       attempts: 1 // Retry calling lock API up to 3 times if it fails
// //     });
// //     console.log(`Job ${job.id} created for user ${userId}`);
// //     console.log("rentalDurationInMilliseconds", rentalDurationInMilliseconds);
// //     // Send immediate response
// //     res.status(201).json({
// //       message: 'Rental created successfully',
// //       jobId: job.id // Return the job ID for client-side tracking
// //     });

// //     // Listen for job completion
// //     job.finished().then((result) => {
// //       console.log(`Job ${job.id} for user ${userId} completed successfully`, result);
// //       // Notify the user
// //       const io = getIo();
// //       io.to(userId).emit('rentalCompleted', { jobId: job.id, result });
// //     }).catch((error) => {
// //       console.error(`Job ${job.id} for user ${userId} failed`, error);
// //       // Notify the user about the failure
// //       const io = getIo();
// //       io.to(userId).emit('rentalFailed', { jobId: job.id, error: error.message });
// //     });
// //   } catch (error) {
// //     next(error); // Forward error to global error handler
// //   }
// // };

// // module.exports = {
// //   createRental
// // };

// // // const createRental = async (req, res) => {
// // //   const { rentalId, rentalDurationInMilliseconds } = req.body;

// // //   try {
// // //     console.log(`Creating rental: ${rentalId} ${rentalDurationInMilliseconds}`);
// // //     // Add job to queue when a rental is created
// // //     const job = await rentalQueue.add({
// // //       rentalId: rentalId,
// // //       userId: req.user.id // Add userId to job data
// // //     }, {
// // //       delay: rentalDurationInMilliseconds, // Delay until the rental expires
// // //       attempts: 1 // Retry calling lock API up to 3 times if it fails
// // //     });

// // //     // Send immediate response
// // //     res.status(201).json({
// // //       message: 'Rental created successfully',
// // //       jobId: job.id, // Return the job ID for client-side tracking,
// // //       userId: req.user.id // Return the user ID for client-side tracking
// // //     });

// // //     // Listen for job completion
// // //     job.finished().then((result) => {
// // //       console.warn(`Job ${job.id} completed successfully, result:`, result);

// // //     }).catch((error) => {
// // //       console.warn(`Job ${job.id} failed, error:`, error);
// // //     });
// // //   } catch (error) {
// // //     res.status(500).json({
// // //       message: 'Failed to create rental',
// // //       error: error.message
// // //     });
// // //   }
// // // };

// // // module.exports = {
// // //   createRental
// // // };



// const rentalQueue = require('../rentalQueue'); // Import the rental queue

// const createRental = async (req, res, next) => {
//   const { rentalId, rentalDurationInMilliseconds } = req.body;
//   const userId = req.body.userId || req.user.id; // Get userId from request or user session

//   try {
//     console.log(`Creating rental: rentalId=${rentalId}, duration=${rentalDurationInMilliseconds}`);

//     // Add job to queue with a delay
//     const job = await rentalQueue.add(
//       {
//         rentalId, // The rental ID
//         userId,   // The user ID
//       },
//       {
//         delay: rentalDurationInMilliseconds, // Delay until the rental expires
//         attempts: 3, // Retry 3 times if job fails
//       }
//     );

//     console.log(`Job ${job.id} created for user ${userId}`);

//     // Send an immediate response to the client
//     res.status(201).json({
//       message: 'Rental created successfully',
//       jobId: job.id, // Return the job ID for client-side tracking
//       userId, // Return the user ID for client-side tracking
//     });

//     // Job completion is now handled globally via rentalQueue.on('completed') in rentalQueue.js

//   } catch (error) {
//     console.error('Error creating rental:', error);
//     next(error); // Forward the error to the global error handler
//   }
// };

// module.exports = {
//   createRental,
// };


const rentalQueue = require('../rentalQueue'); // Import the rental queue
const { getIo } = require('../webSocketServer'); // Ensure correct function name

// const createRental = async (req, res, next) => {
//   const { rentalId, rentalDurationInMilliseconds } = req.body;
//   const userId = req.body.userId || req.user.id; // req.user.id is populated by the temporary user ID middleware

//   try {
//     console.log(`Creating rental: ${rentalId} ${rentalDurationInMilliseconds}`);
//     // Add job to queue when a rental is created
//     const job = await rentalQueue.add({
//       rentalId: rentalId,
//       userId: userId, // Add userId to job data
//     }, {
//       delay: rentalDurationInMilliseconds, // Delay until the rental expires
//       attempts: 1 // Retry calling lock API up to 3 times if it fails
//     });

//     // Send immediate response
//     res.status(201).json({
//       message: 'Rental created successfully',
//       jobId: job.id // Return the job ID for client-side tracking
//     });

//     // Listen for job completion
//     job.finished().then((result) => {
//       console.log(`Job ${job.id} for user ${userId} completed successfully`, result);
//       // Notify the user
//       const io = getIo();
//       io.to(userId).emit('rentalCompleted', { jobId: job.id, result });
//     }).catch((error) => {
//       console.error(`Job ${job.id} for user ${userId} failed`, error);
//       // Notify the user about the failure
//       const io = getIo();
//       io.to(userId).emit('rentalFailed', { jobId: job.id, error: error.message });
//     });
//   } catch (error) {
//     next(error); // Forward error to global error handler
//   }
// };

// module.exports = {
//   createRental
// };

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