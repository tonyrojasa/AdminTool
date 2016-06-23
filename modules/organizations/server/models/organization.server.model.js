'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Organization Schema
 */
var OrganizationSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Organization name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: 'Please fill Organization name',
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

mongoose.model('Organization', OrganizationSchema);
