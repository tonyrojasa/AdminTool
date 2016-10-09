'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Event Schema
 */
var EventGroupSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Event name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  event: {
    type: Schema.ObjectId,
    ref: 'Event'
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

mongoose.model('EventGroup', EventGroupSchema);

var eventParticipantSchema = new Schema({
  person: {
    type: Schema.ObjectId,
    required: 'Please fill student',
    ref: 'Person'
  },
  eventGroup: {
    type: Schema.ObjectId,
    ref: 'EventGroup'
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

mongoose.model('eventParticipant', eventParticipantSchema);