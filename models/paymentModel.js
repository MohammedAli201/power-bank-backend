// // const mongoose = require('mongoose');

// // // Define the payment schema
// // const paymentSchema = new mongoose.Schema({
// //   stationId: {
// //     type: String,
// //     required: [true, 'A payment must have a station ID'],
// //     trim: true,
// //   },
// //   userId: {
// //     type: String,
// //     required: [true, 'A payment must have a user ID'],
// //   },
// //   slotId: {
// //     type: Number,
// //     required: [true, 'A payment must have a slot ID'],
// //   },
// //   evcReference: {
// //     type: String,
// //     required: [true, 'A payment must have an EVC reference'],
// //   },
// //   timestampEvc: {
// //     type: Date,
// //     required: [true, 'A payment must have an EVC timestamp'],
// //   },
// //   createdAt: {
// //     type: Date,
// //     default: Date.now,
// //     select: false,
// //   },
// //   phoneNumber: {
// //     type: String,
// //     required: [true, 'A payment must have a phone number'],
// //   },
// //   amount: {
// //     type: Number,
// //     required: [true, 'A payment must have an amount'],
// //   },
// //   isPaid: {
// //     type: Boolean,
// //     required: [true, 'Payment status (isPaid) must be specified'],
// //   },
// //   endRentTime: {
// //     type: Date,
// //     required: [true, 'An end rent time must be specified'],
// //   },
// //   startTime: {
// //     type: Date,
// //     required: [true, 'A start time must be specified'],
// //   },
// //   hoursPaid: {
// //     type: Number,
// //     required: [true, 'The number of paid hours must be specified'],
// //   },
// //   millisecondsPaid: {
// //     type: Number,
// //     required: [true, 'The number of paid milliseconds must be specified'],
// //   },
// //   currency: {
// //     type: String,
// //     default: 'USD',
// //     required: [true, 'Currency must be specified'],
// //   },
// //   paymentStatus: {
// //     type: String,
// //     enum: ['active', 'inactive'],
// //     required: [true, 'A payment must have a status'],
// //   },
// //   lockStatus: {
// //     type: Number,
// //     enum: [0, 1],
// //     required: [true, 'A lock status must be specified'],
// //   },
// // })
// // const Payment = mongoose.model('Payment', paymentSchema);

// // module.exports = Payment;
// const mongoose = require('mongoose');

// const paymentSchema = new mongoose.Schema({
//   stationId: {
//     type: String,
//     required: [true, 'A payment must have a station ID'],
//     trim: true,
//   },
//   phoneNumber: {
//     type: String,
//     required: [true, 'A payment must have a phone number'],
//   },
//   branch_name: {
//     type: String,
//     required: [true, 'A payment must have a branch name'],
//   },
//   slotId: {
//     type: Number,
//     required: [true, 'A payment must have a slot ID'],
//   },
//   battery_id: {
//     type: String,
//     required: [true, 'A payment must have a battery ID'],
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
// });

// const Payment = mongoose.model('Payment', paymentSchema);

// module.exports = Payment;


const mongoose = require('mongoose');
const moment = require('moment-timezone');

// const paymentSchema = new mongoose.Schema({
//   stationId: {
//     type: String,
//     required: [true, 'A payment must have a station ID'],
//     trim: true,
//   },
//   phoneNumber: {
//     type: String,
//     required: [true, 'A payment must have a phone number'],
//   },
//   branch_name: {
//     type: String,
//     required: [true, 'A payment must have a branch name'],
//   },
//   slotId: {
//     type: Number,
//     required: [true, 'A payment must have a slot ID'],
//   },
//   battery_id: {
//     type: String,
//     required: [true, 'A payment must have a battery ID'],
//   },
//   evcReference: {
//     type: String,
//     required: [true, 'A payment must have an EVC reference'],
//   },
//   // timestampEvc: {
//   //   type: Date,
//   //   required: [true, 'A payment must have an EVC timestamp'],
//   //   set: (value) => moment.tz(value, 'Africa/Mogadishu').utc().toDate(), // Convert to UTC when setting
//   //   get: (value) => moment.utc(value).tz('Africa/Mogadishu').format(), // Convert back to Mogadishu time when retrieving
//   // },
//   timestampEvc: {
//     type: Date,
//     required: [true, 'A payment must have an EVC timestamp'],
//     set: (value) => moment.tz(value, 'Africa/Mogadishu').format(), // Format as string with timezone
//     // get: function(value) {
//     //   const timeZone =  'Africa/Mogadishu'; // Use provided time zone or default to Africa/Abidjan
//     //   return moment(value).tz(timeZone).format(); // Format in the specified time zone when retrieving
//     // }, // Convert back to Mogadishu time when retrieving
//   },
//   createdAt: {
//     type: Date,
//    required: [true, 'A payment must have a creation date'],
//    set: (value) => moment.tz(value, 'Africa/Mogadishu').format(), // Format as string with timezone
//    // get: function(value) {
//     //   const timeZone =  'Africa/Mogadishu'; // Use provided time zone or default to Africa/Abidjan
//     //   return moment(value).tz(timeZone).format(); // Format in the specified time zone when retrieving
//     // },
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
//     set: (value) => moment.tz(value, 'Africa/Mogadishu').format(), // Format as string with timezone
//     // get: function(value) {
//     //   const timeZone =  'Africa/Mogadishu'; // Use provided time zone or default to Africa/Abidjan
//     //   return moment(value).tz(timeZone).format(); // Format in the specified time zone when retrieving
//     // }, // Convert back to Mogadishu time when retrieving
//   },
//   startTime: {
//     type: Date,
//     required: [true, 'A start time must be specified'],
//     // Convert back to Mogadishu time when retrieving
//     set: (value) => moment.tz(value, 'Africa/Mogadishu').format(), // Format as string with timezone
    
   
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
// });

// // Ensure that the getters are applied to all date fields on `toJSON` and `toObject`
// paymentSchema.set('toJSON', { getters: true });
// paymentSchema.set('toObject', { getters: true });

// const Payment = mongoose.model('Payment', paymentSchema);

// module.exports = Payment;
// const mongoose = require('mongoose');
// s
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
  branch_name: {
    type: String,
    required: [true, 'A payment must have a branch name'],
  },
  slotId: {
    type: Number,
    required: [true, 'A payment must have a slot ID'],
  },
  battery_id: {
    type: String,
    required: [true, 'A payment must have a battery ID'],
  },
  evcReference: {
    type: String,
    required: [true, 'A payment must have an EVC reference'],
  },
  timestampEvc: {
    type: String,
    required: [true, 'A payment must have an EVC timestamp'],
    set: (value) => moment.tz(value, 'Africa/Mogadishu').format(), // Format as string with timezone
  },
  createdAt: {
    type: String,
    required: [true, 'A payment must have a creation date'],
    set: (value) => moment.tz(value, 'Africa/Mogadishu').format(), // Format as string with timezone
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
    type: String,
    required: [true, 'An end rent time must be specified'],
    set: (value) => moment.tz(value, 'Africa/Mogadishu').format(), // Format as string with timezone
  },
  startTime: {
    type: String,
    required: [true, 'A start time must be specified'],
    set: (value) => moment.tz(value, 'Africa/Mogadishu').format(), // Format as string with timezone
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
  term_and_conditions: {
    type: Boolean,
    required: [true, 'A payment must have terms and conditions'],
  },
});

// Middleware to ensure the createdAt field is saved in the Africa/Mogadishu timezone
paymentSchema.pre('save', function(next) {
  this.createdAt = moment.tz(this.createdAt, 'Africa/Mogadishu').format();
  next();
});

// Ensure that the getters are applied to all fields on `toJSON` and `toObject`
paymentSchema.set('toJSON', { getters: true });
paymentSchema.set('toObject', { getters: true });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
