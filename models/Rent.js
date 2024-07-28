const mongoose = require('mongoose');

const rentSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: [true, 'A rent must have a phone number'],
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: true, // Link to the Payment
  },
  powerbankId: {
    type: String,
    required: [true, 'A rent must have a powerbank ID'],
  },
  startTime: {
    type: Date,
    required: [true, 'A start time must be specified'],
  },
  endTime: {
    type: Date,
    required: [false, 'An end time must be specified'],
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'returned'],
    required: [true, 'A rent must have a status'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Rent = mongoose.model('Rent', rentSchema);

module.exports = Rent;
