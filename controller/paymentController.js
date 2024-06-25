// controller/paymentController.js
const Payment = require('../models/paymentModel');

exports.createPayment = async (req, res, next) => {
    console.log(req.body);
//   try {
//     const newPayment = await Payment.create(req.body);
//     res.status(201).json({
//       status: 'success',
//       data: {
//         payment: newPayment,
//       },
//     });
//   } catch (err) {
//     console.error('Error creating payment:', err); // Log the error
//     res.status(500).json({
//       status: 'error',
//       message: 'Internal Server Error', // Return a generic message to client
//     });
//   }
};


exports.evc_paymentRequest = async (req, res, next) => {
    try {
        
        const time = new Date().toISOString();
        
        res.status(201).json({
            status: 'Request payment is made  is successful',
            body: req.body ,
            time: time


            
        });
    }
    catch (err) {
        console.error('Error creating payment:', err); // Log the error
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error', // Return a generic message to client
        });
    }
}


exports.unlock = async (req, res, next) => {
    try {
        
        
        res.status(201).json({
            status: 'Unlocking is successful',
            
        });
    }
    catch (err) {
        console.error('Error creating payment:', err); // Log the error
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error', // Return a generic message to client
        });
    }
}


// router/paymentRouter.js
