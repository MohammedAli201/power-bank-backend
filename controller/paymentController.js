// controllers/paymentController.js
const dotenv = require('dotenv');// dotenv.config({ path: './config.env' });
dotenv.config();
const Payment = require('../models/paymentModel');
// const config = require('../config/config');
const WaafiPay = require('waafipay-sdk-node');
const waafipay = new WaafiPay.API(
  process.env.API_KEY,
  process.env.APIUSERID,
  process.env.MERCHANTUID, 
  { testMode: true }
);

const preAuthorizeCancel = (params) => {
  return new Promise((resolve, reject) => {
    waafipay.preAuthorizeCancel(params, (error, body) => {
      if (error) {
        return reject(error);
      }
      resolve(body);
    });
  });
};

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

exports.savePaymentInfoWithUserInfo = async (req, res) => {
  try {
    const paymentInfo = await Payment.create(req.body); // Directly use req.body
    return res.status(200).json({
      message: "The payment operation is completed",
      paymentInfo: paymentInfo,
    });
  } catch (error) {
    console.error('Error during paymentSaveInfo API call:', error);
    res.status(400).json({ message: 'Payment saving request failed', error: error.message });
  }
};


exports.findByPhoneNumber = async (req, res) => {
  const { phoneNumber } = req.params; // Assuming the phone number is passed as a URL parameter
  console.log(typeof(phoneNumber))

  try {
    
    const paymentInfo = await Payment.find({ phoneNumber });
    if (!paymentInfo.length) {
      return res.status(404).json({
        message: "No payment information found for this phone number",
      });
    }

    return res.status(200).json({
      message: "Payment information retrieved successfully",
      paymentInfo,
    });
  } catch (error) {
    console.error('Error during findByPhoneNumber API call:', error);
    res.status(500).json({ message: 'Request failed', error: error.message });
  }
};




exports.updatePaymentStatus = async (req, res) => {
  const { phoneNumber } = req.params;

  try {
    const currentDateTime = new Date();
    console.log("Current Date and Time:", currentDateTime);

    const paymentInfo = await Payment.findOne({
      phoneNumber,
      paymentStatus: 'active',
      lockStatus: 1,
      endRentTime: { $lte: currentDateTime }
    });

    if (!paymentInfo) {
      console.log("No active payment found or end time has not been reached yet.");
      return res.status(404).json({
        message: "No active payment found for this phone number with the end time reached or almost reached and lock status of 1",
      });
    }

    console.log("Matching Payment End Time:", paymentInfo.endRentTime);

    paymentInfo.paymentStatus = 'inactive';
    paymentInfo.lockStatus = 0;
    await paymentInfo.save();

    return res.status(200).json({
      message: "Payment status updated successfully",
      paymentInfo,
    });
  } catch (error) {
    console.error('Error during updatePaymentStatus API call:', error);
    res.status(500).json({ message: 'Request failed', error: error.message });
  }
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

    const transactionId = preAuthResult.params?.transactionId;
    if (!transactionId) {
      throw new Error('TransactionId is not provided in the preAuthorize response');
    }

    const commitResult = await preAuthorizeCommit({
      transactionId: transactionId,
      description: 'committed',
    });

    res.status(200).json(commitResult);
  } catch (error) {
    console.error('Error during WaafiPay API call:', error);
    res.status(400).json({ message: 'Payment request failed', error: error.message });
  }
};

exports.cancelPayment = async (req, res, next) => {
  try {
    const { transactionId } = req.body;
    if (!transactionId) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }
    const cancelResult = await preAuthorizeCancel({
      transactionId: transactionId,
      description: 'cancelled',
    });
    res.status(200).json(cancelResult);
  } catch (error) {
    console.error('Error during WaafiPay API call:', error);
    res.status(400).json({ message: 'Payment request failed', error: error.message });
  }
};

exports.createPayment = async (req, res, next) => {
  console.log(req.body);
  // Implementation here
};

exports.unlock = async (req, res, next) => {
  try {
    res.status(201).json({
      status: 'Unlocking is successful',
    });
  } catch (err) {
    console.error('Error during unlocking:', err);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};
