'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

/**
 * Eventregistration Schema
 */
var EventregistrationSchema = new Schema({
  registrationNumber: {
    type: Number
  },
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
  assignedSector: {
    type: String,
    default: ''
  },
  balanceAmount: {
    type: Number,
    default: '',
    required: 'Please fill balance amount'
  },
  shirtsQuantity: {
    type: Number,
    default: 0,
    trim: true
  },
  shirtTypes: {
    type: Array
  },
  isEventServer: {
    type: Boolean,
    default: false,
    trim: true
  },
  eventExternalServer: {
    isEventExternalServer: {
      type: Boolean,
      default: false
    },
    specialPrice: {
      type: Number,
      default: 0
    }
  },
  personType: {
    type: Schema.ObjectId,
    ref: 'Persontype'
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
EventregistrationSchema.plugin(autoIncrement.plugin, {
  model: 'Eventregistration',
  field: 'registrationNumber',
  startAt: 1,
  incrementBy: 1
});
mongoose.model('Eventregistration', EventregistrationSchema);