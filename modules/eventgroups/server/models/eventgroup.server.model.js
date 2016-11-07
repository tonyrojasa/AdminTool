'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Eventgroup Schema
 */
var EventgroupSchema = new Schema({
  leader: {
    type: Schema.ObjectId,
    ref: 'Eventregistration'
  },
  assistant: {
    type: Schema.ObjectId,
    ref: 'Eventregistration'
  },
  members: [{
    type: Schema.ObjectId,
    ref: 'Eventregistration'
  }],
  event: {
    type: Schema.ObjectId,
    required: 'Please fill Event',
    ref: 'Event'
  },
  eventPeopleGroup: {
    required: 'Please select the event group',
    type: Schema.ObjectId,
    ref: 'Eventpeoplegroup'
  },
  name: {
    type: String,
    default: '',
    required: 'Please fill Eventgroup name',
    trim: true
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

EventgroupSchema.pre('validate', function(next) {
  // capitalize and lower case the other characters
  this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
  next();
});

EventgroupSchema.index({
  name: 1,
  event: 1,
  eventPeopleGroup: 1
}, {
  unique: true
});

mongoose.model('Eventgroup', EventgroupSchema);