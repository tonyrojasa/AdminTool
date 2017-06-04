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
  serviceArea: [{
    type: Schema.ObjectId,
    ref: 'Servicearea'
  }],
  location: {
    type: Schema.ObjectId,
    ref: 'location'
  },
  contactInfo: [{
    personName: {
      type: String
    },
    phoneNumber: {
      type: String
    },
    homeAddress: {
      type: String
    },
    relationship: {
      type: String
    }
  }],
  personType: {
    type: Schema.ObjectId,
    ref: 'Persontype'
  },
  personId: {
    type: String
  }, 
  personIdType: {
    type: String,
    default: "physical"
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
    trim: true
  },
  birthDate: {
    type: Date,
    trim: true
  },
  age: {
    type: Number,
    trim: true
  },
  maritalStatus: {
    type: String,
    trim: true
  },
  isFemale: {
    type: Boolean,
    default: false,
    required: 'Please fill isFemale sex'
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
  sponsorship: {
    exists: {
      type: Boolean,
      default: false,
      trim: true
    },
    sponsorName: {
      type: String,
      trim: true
    },
    phoneNumber: {
      type: String,
      trim: true
    },
    comments: {
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