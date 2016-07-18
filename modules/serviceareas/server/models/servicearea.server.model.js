'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Servicearea Schema
 */
var ServiceareaSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Servicearea name',
    trim: true
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

mongoose.model('Servicearea', ServiceareaSchema);