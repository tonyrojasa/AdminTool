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

ServiceareaSchema.pre('validate', function(next) {
  // capitalize and lower case the other characters
  this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
  next();
});

mongoose.model('Servicearea', ServiceareaSchema);