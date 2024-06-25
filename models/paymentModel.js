// models/paymentModel.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  stationName: {
    type: String,
    required: [true, 'A payment must have a station name'],
    trim: true,
  },
  duration: {
    type: Date,
    required: [true, 'A rent power must have a duration'],
  },
  paymentDate: {
    type: Date,
    required: [true, 'A payment must have a date'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'A payment must have a phone number'],
  },
  slot_id: {
    type: Number,
    required: [true, 'A payment must have a slot ID'],
  },
  slot_capacity: {
    type: Number, // Corrected from `slot_capity` to `slot_capacity`
    required: [true, 'A slot must have a capacity'],
  },
  amount: {
    type: Number,
    required: [true, 'A payment must have an amount'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
