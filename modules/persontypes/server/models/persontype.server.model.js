'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Persontype Schema
 */
var PersontypeSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Persontype name',
    trim: true
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

mongoose.model('Persontype', PersontypeSchema);