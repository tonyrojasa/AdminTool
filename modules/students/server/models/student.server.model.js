'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Student Schema
 */
var StudentSchema = new Schema({
  person: {
    type: Schema.ObjectId,
    required: 'Please fill student',
    ref: 'Person'
  },
  serviceAcademyClass: {
    type: Schema.ObjectId,
    required: 'Please fill serviceAcademyClass',
    ref: 'Serviceacademyclass'
  },
  score: {
    type: Number
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

StudentSchema.index({
  person: 1,
  serviceAcademyClass: 1
}, {
  unique: true
});
mongoose.model('Student', StudentSchema);