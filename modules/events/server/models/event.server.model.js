'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Event Schema
 */
var EventSchema = new Schema({
  organization: {
    type: Schema.ObjectId,
    ref: 'Organization'
  },
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
  startDate: {
    type: Date,
    default: Date.now,
    required: 'Please fill Event startDate'
  },
  endDate: {
    type: Date,
    required: 'Please fill Event endDate'
  },
  openEnrollment: {
    type: Boolean,
    default: true
  },
  ended: {
    type: Boolean,
    default: false
  },
  quickRegistration: {
    type: Boolean,
    default: false
  },
  nonRegistration: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    default: '',
    trim: true
  },
  serverPrice: {
    type: Number,
    default: 0,
    trim: true
  },
  shirtPrice: {
    type: Number,
    default: 0,
    trim: true
  },
  shirtTypes: {
    type: Array
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

mongoose.model('Event', EventSchema);