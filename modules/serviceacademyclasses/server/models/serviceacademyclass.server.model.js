'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Serviceacademyclass Schema
 */
var ServiceacademyclassSchema = new Schema({
  organization: {
    type: Schema.ObjectId,
    ref: 'Organization'
  },
  teacher: {
    type: Schema.ObjectId,
    ref: 'Person'
  },
  name: {
    type: String,
    default: '',
    required: 'Please fill name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  schedule: {
    type: [String],
    required: 'Please fill schedule'
  },
  level: {
    type: Number,
    enum: [1, 2, 3],
    default: 1,
    required: 'Please fill level'
  },
  startDate: {
    type: Date,
    default: Date.now,
    required: 'Please fill startDate'
  },
  endDate: {
    type: Date,
    required: 'Please fill endDate'
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

mongoose.model('Serviceacademyclass', ServiceacademyclassSchema);