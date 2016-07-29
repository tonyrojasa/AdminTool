'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Assistance Schema
 */
var AssistanceSchema = new Schema({
  event: {
    type: Schema.ObjectId,
    ref: 'Event'
  },
  serviceAcademyClass: {
    type: Schema.ObjectId,
    ref: 'Serviceacademyclass'
  },
  assistants: [{
    person: {
      type: Schema.ObjectId,
      ref: 'Person'
    },
    status: {
      type: String,
      enum: ['late', 'early', 'absent'],
      default: 'absent'
    }
  }],
  description: {
    type: String,
    default: '',
    trim: true
  },
  assistanceDate: {
    type: Date,
    default: Date.now,
    required: 'Please fill assistanceDate'
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

mongoose.model('Assistance', AssistanceSchema);