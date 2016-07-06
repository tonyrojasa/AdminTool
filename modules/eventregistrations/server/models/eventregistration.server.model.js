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
  eventPeopleGroup: {
    required: 'Please select the event group',
    type: Schema.ObjectId,
    ref: 'Eventpeoplegroup'
  },
  event: {
    type: Schema.ObjectId,
    ref: 'Event'
  },
  person: {
    type: Schema.ObjectId,
    ref: 'Person'
  },
  registrationDate: {
    type: Date,
    default: Date.now
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
