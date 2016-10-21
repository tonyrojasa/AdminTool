'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

/**
 * Receipt Schema
 */
var ReceiptSchema = new Schema({
  event: {
    type: Schema.ObjectId,
    ref: 'Event'
  },
  eventRegistration: {
    type: Schema.ObjectId,
    ref: 'Eventregistration'
  },
  receiptNumber: {
    type: Number
  },
  receivedFrom: {
    type: String,
    default: '',
    required: 'Please fill receivedFrom',
    trim: true
  },
  receivedBy: {
    type: String,
    default: '',
    required: 'Please fill receivedBy',
    trim: true
  },
  paymentOf: {
    type: String,
    default: '',
    required: 'Please fill paymentOf',
    trim: true
  },  
  paidBy: {
    type: String,
    default: 'Efectivo',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  otherReference: {
    type: String,
    default: '',
    trim: true
  },
  currentBalance: {
    type: Number,
    default: '',
    required: 'Please fill currentBalance',
    trim: true
  },
  paymentAmount: {
    type: Number,
    default: '',
    required: 'Please fill paymentAmount',
    trim: true
  },
  balanceDue: {
    type: Number,
    default: '',
    required: 'Please fill balanceDue',
    trim: true
  },
  isDebit: {
    type: Boolean,
    default: false,
    required: 'Please fill isDebit'
  },
  paymentDate: {
    type: Date,
    default: Date.now,
    required: 'Please fill paymentDate'
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

autoIncrement.initialize(mongoose.connection);
ReceiptSchema.plugin(autoIncrement.plugin, {
  model: 'Receipt',
  field: 'receiptNumber',
  startAt: 1,
  incrementBy: 1
});
mongoose.model('Receipt', ReceiptSchema);