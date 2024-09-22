const moment = require('moment-timezone');


function createPaymentData(reqBody, transactionId, unlockResult, commitResult) {
    console.log('commitResult:', commitResult);
  return {
    stationId: reqBody.stationName,
    branch_name: reqBody.branch_name,
    phoneNumber: reqBody.phoneNumber,
    slotId: reqBody.slot_id,
    createdAt: req.createdAt, // Use the current timestamp
    battery_id: unlockResult.data?.batteryId || null, // Assuming batteryId comes from unlockResult
    evcReference: transactionId,
    timestampEvc: req.createdAt, // Use current timestamp
    amount: reqBody.amount,
    isPaid: reqBody.isPaid || true, // Default to true if not provided
    endRentTime: reqBody.endRentTime , // Default to 1-hour rental if not provided
    startTime: reqBody.startTime ,
    hoursPaid: reqBody.hoursPaid || 1, // Default to 1 hour
    millisecondsPaid: reqBody.millisecondsPaid || 1 * 60 * 60 * 1000, // Default to 1 hour in milliseconds
    currency: reqBody.currency,
    paymentStatus: reqBody.paymentStatus || 'active', // Default to 'active'
    lockStatus: reqBody.lockStatus || 1, // Default to 1
    term_and_conditions: reqBody.term_and_conditions || true, // Default to true if not provided
  };
}



function createRentData(reqBody, paymentId) {
  return {
    phoneNumber: reqBody.phoneNumber,
    paymentId: paymentId,
    createdAt: req.createdAt, // Use the current timestamp
    powerbankId: reqBody.stationName, // Assuming powerbankId is the correct field
    startTime: reqBody.startTime || moment().format(),
    endTime: reqBody.endRentTime || moment().add(1, 'hours').format(), // Default to 1-hour rental if not provided
    status: reqBody.status || 'active', // Default to 'active'
  };
}

module.exports = { createPaymentData, createRentData };
