const mongoose = require('mongoose');
const moment = require('moment-timezone');

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
    type: String,  // Store as string to preserve exact timezone
    required: [true, 'A start time must be specified'],
    set: (value) => moment.tz(value, 'Africa/Mogadishu').format(), // Format as string with timezone
  },
  endTime: {
    type: String,  // Store as string to preserve exact timezone
    required: [false, 'An end time must be specified'],
    set: (value) => moment.tz(value, 'Africa/Mogadishu').format(), // Format as string with timezone
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'returned'],
    required: [true, 'A rent must have a status'],
  },
  createdAt: {
    type: String,  // Store as string to preserve exact timezone
    required: [true, 'A rent must have a creation date'],
    set: (value) => moment.tz(value, 'Africa/Mogadishu').format(), // Format as string with timezone
  },
  lockStatus: {
    type: Number,
    enum: [0, 1],
  }
});

// Middleware to ensure the createdAt field is saved in the Africa/Mogadishu timezone
rentSchema.pre('save', function(next) {
  this.createdAt = moment.tz(this.createdAt, 'Africa/Mogadishu').format();
  next();
});

// Ensure that the getters are applied to all fields on `toJSON` and `toObject`
rentSchema.set('toJSON', { getters: true });
rentSchema.set('toObject', { getters: true });

const Rent = mongoose.model('Rent', rentSchema);

module.exports = Rent;