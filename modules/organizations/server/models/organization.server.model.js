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
    trim: true,
    unique: true
  },
  description: {
    type: String,
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

OrganizationSchema.pre('validate', function(next) {
  // capitalize and lower case the other characters
  this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
  next();
});

mongoose.model('Organization', OrganizationSchema);