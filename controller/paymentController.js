const config = require('../config/config');
const WaafiPay = require('waafipay-sdk-node');
const waafipay = new WaafiPay.API(
  config.API_KEY,
  config.APIUSERID,
  config.MERCHAT_ID, 
  { testMode: true }
);

const preAuthorize = (params) => {
  return new Promise((resolve, reject) => {
    waafipay.preAuthorize(params, (error, body) => {
      if (error) {
        return reject(error);
      }
      resolve(body);
    });
  });
};

const preAuthorizeCommit = (params) => {
  return new Promise((resolve, reject) => {
    waafipay.preAuthorizeCommit(params, (error, body) => {
      if (error) {
        return reject(error);
      }
      resolve(body);
    });
  });
};

exports.evc_paymentRequest = async (req, res) => {
  console.log('Received request for evc_paymentRequest:', req.body);

  const { accountNo, amount, currency, description } = req.body;

  if (!accountNo || !amount || !currency || !description) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  try {
    const preAuthResult = await preAuthorize({
      paymentMethod: 'MWALLET_ACCOUNT',
      accountNo: accountNo,
      amount: amount,
      currency: currency,
      description: description,
    });

    console.log('WaafiPay PreAuthorize API response:', preAuthResult);

    const transactionId = preAuthResult.params?.transactionId;
    if (!transactionId) {
      throw new Error('TransactionId is not provided in the preAuthorize response');
    }

    const commitResult = await preAuthorizeCommit({
      transactionId: transactionId,
      description: 'committed',
    });

    console.log('WaafiPay PreAuthorize Commit API response:', commitResult);
    res.status(200).json(commitResult);
  } catch (error) {
    console.error('Error during WaafiPay API call:', error);
    res.status(400).json({ message: 'Payment request failed', error: error.message });
  }
};

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
