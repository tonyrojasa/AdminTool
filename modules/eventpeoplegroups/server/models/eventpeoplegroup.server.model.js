'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Eventpeoplegroup Schema
 */
var EventpeoplegroupSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Eventpeoplegroup name',
    trim: true,
    unique: true
  },
  description: {
    type: String,
    default: '',
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

mongoose.model('Eventpeoplegroup', EventpeoplegroupSchema);