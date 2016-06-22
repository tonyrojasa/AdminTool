'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Eventregistration Schema
 */
var EventregistrationSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Eventregistration name',
    trim: true
  },
  eventGroup: {
    type: String,
    default: '',
    required: 'Please select the event group',
    trim: true
  },
  personname: {
    type: String,
    default: '',
    required: 'Please fill Eventregistration name',
    trim: true
  },
  email: {
    type: String,
    default: '',
    required: 'Please fill email address',
    trim: true
  },
  person: {
    type: Schema.ObjectId,
    ref: 'Person'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  shirtSize: {
    type: String,
    default: '',
    required: 'Please fill t-shirt size',
    trim: true
  },
  sponsorship: {
    sponsorRequired: Boolean,
    sponsor: {
      type: Schema.ObjectId,
      ref: 'Person'
    },
    percentage: Number,
    comments: String
  },
  balanceAmount: {
    type: Number,
    default: '',
    required: 'Please fill balance amount'
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

mongoose.model('Eventregistration', EventregistrationSchema);
