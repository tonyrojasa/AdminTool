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
  serviceAcademyClass: {
    type: Schema.ObjectId,
    ref: 'Serviceacademyclass'
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
  maxQuantityPerPerson: {
    type: Number,
    default: 1,
    trim: true
  },
  maxEventFemaleQuantity: {
    type: Number,
    default: 1,
    trim: true
  },
  maxEventMaleQuantity: {
    type: Number,
    default: 1,
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

mongoose.model('Event', EventSchema);