// const mongoose = require('mongoose');

// // Define the payment schema
// const paymentSchema = new mongoose.Schema({
//   stationId: {
//     type: String,
//     required: [true, 'A payment must have a station ID'],
//     trim: true,
//   },
//   userId: {
//     type: String,
//     required: [true, 'A payment must have a user ID'],
//   },
//   slotId: {
//     type: Number,
//     required: [true, 'A payment must have a slot ID'],
//   },
//   evcReference: {
//     type: String,
//     required: [true, 'A payment must have an EVC reference'],
//   },
//   timestampEvc: {
//     type: Date,
//     required: [true, 'A payment must have an EVC timestamp'],
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//     select: false,
//   },
//   phoneNumber: {
//     type: String,
//     required: [true, 'A payment must have a phone number'],
//   },
//   amount: {
//     type: Number,
//     required: [true, 'A payment must have an amount'],
//   },
//   isPaid: {
//     type: Boolean,
//     required: [true, 'Payment status (isPaid) must be specified'],
//   },
//   endRentTime: {
//     type: Date,
//     required: [true, 'An end rent time must be specified'],
//   },
//   startTime: {
//     type: Date,
//     required: [true, 'A start time must be specified'],
//   },
//   hoursPaid: {
//     type: Number,
//     required: [true, 'The number of paid hours must be specified'],
//   },
//   millisecondsPaid: {
//     type: Number,
//     required: [true, 'The number of paid milliseconds must be specified'],
//   },
//   currency: {
//     type: String,
//     default: 'USD',
//     required: [true, 'Currency must be specified'],
//   },
//   paymentStatus: {
//     type: String,
//     enum: ['active', 'inactive'],
//     required: [true, 'A payment must have a status'],
//   },
//   lockStatus: {
//     type: Number,
//     enum: [0, 1],
//     required: [true, 'A lock status must be specified'],
//   },
// })
// const Payment = mongoose.model('Payment', paymentSchema);

// module.exports = Payment;
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  stationId: {
    type: String,
    required: [true, 'A payment must have a station ID'],
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: [true, 'A payment must have a phone number'],
  },
  slotId: {
    type: Number,
    required: [true, 'A payment must have a slot ID'],
  },
  evcReference: {
    type: String,
    required: [true, 'A payment must have an EVC reference'],
  },
  timestampEvc: {
    type: Date,
    required: [true, 'A payment must have an EVC timestamp'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
  amount: {
    type: Number,
    required: [true, 'A payment must have an amount'],
  },
  isPaid: {
    type: Boolean,
    required: [true, 'Payment status (isPaid) must be specified'],
  },
  endRentTime: {
    type: Date,
    required: [true, 'An end rent time must be specified'],
  },
  startTime: {
    type: Date,
    required: [true, 'A start time must be specified'],
  },
  hoursPaid: {
    type: Number,
    required: [true, 'The number of paid hours must be specified'],
  },
  millisecondsPaid: {
    type: Number,
    required: [true, 'The number of paid milliseconds must be specified'],
  },
  currency: {
    type: String,
    default: 'USD',
    required: [true, 'Currency must be specified'],
  },
  paymentStatus: {
    type: String,
    enum: ['active', 'inactive'],
    required: [true, 'A payment must have a status'],
  },
  lockStatus: {
    type: Number,
    enum: [0, 1],
    required: [true, 'A lock status must be specified'],
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
