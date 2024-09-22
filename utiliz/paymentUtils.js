// utility/paymentUtils.js (or in an appropriate utility file)

const Payment = require('../models/paymentModel');
const Rent = require('../models/Rent');

async function savePaymentInfoWithUserInfo(paymentData, rentData) {
  try {
    const paymentInfo = await Payment.create(paymentData);
    console.log('Payment Info Saved:', paymentInfo);

    rentData.paymentId = paymentInfo._id;
    const rentInfo = await Rent.create(rentData);
    console.log('Rent Info Saved:', rentInfo);

    return { paymentInfo, rentInfo };
  } catch (error) {
    console.error('Error during savePaymentInfoWithUserInfo API call:', error);
    throw new Error('Payment saving request failed');
  }
}

module.exports = { savePaymentInfoWithUserInfo };
