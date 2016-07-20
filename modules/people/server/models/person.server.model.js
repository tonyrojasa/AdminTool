'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var SchemaTypes = mongoose.Schema.Types;

/**
 * Person Schema
 */
var PersonSchema = new Schema({
  organization: {
    type: Schema.ObjectId,
    ref: 'Organization'
  },
  serviceAcademyClass: {
    type: Schema.ObjectId,
    ref: 'Serviceacademyclass'
  },
  location: {
    type: Schema.ObjectId,
    ref: 'location'
  },
  contactInfo: {
    type: Schema.ObjectId,
    ref: 'Contactifo'
  },
  personType: {
    type: Schema.ObjectId,
    ref: 'Persontype'
  },
  personId: {
    type: Number
  },
  firstName: {
    type: String,
    required: 'Please fill firstName',
    trim: true
  },
  lastName: {
    type: String,
    required: 'Please fill lastName',
    trim: true
  },
  secondLastName: {
    type: String,
    required: 'Please fill secondLastName',
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  mobilePhone: {
    type: String,
    trim: true
  },
  homePhone: {
    type: String,
    trim: true
  },
  otherPhone: {
    type: String,
    trim: true
  },
  activeMember: {
    type: Boolean,
    default: false,
    trim: true
  },
  memberTimeYears: {
    type: Number,
    trim: true
  },
  address: {
    type: String,
    required: 'Please fill address',
    trim: true
  },
  birthDate: {
    type: Date,
    trim: true
  },
  age: {
    type: Number,
    required: 'Please fill age',
    trim: true
  },
  maritalStatus: {
    type: String,
    required: 'Please fill maritalStatus',
    trim: true
  },
  grade: {
    type: String,
    trim: true
  },
  occupation: {
    type: String,
    trim: true
  },
  employer: {
    type: String,
    trim: true
  },
  shirtSize: {
    type: String,
    required: 'Please fill shirtSize',
    trim: true
  },
  medicalTreatment: {
    exists: {
      type: Boolean,
      default: false,
      trim: true
    },
    comments: {
      type: String,
      trim: true
    },
    medicineType: {
      type: String,
      trim: true
    },
    allergies: {
      type: String,
      trim: true
    }
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

mongoose.model('Person', PersonSchema);