'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var mongoose_delete = require('mongoose-delete');

/**
 * EventRegistrationRequest Schema
 */
var EventRegistrationRequestSchema = new Schema({
  requestNumber: {
    type: Number
  },
  event: {
    type: Schema.ObjectId,
    ref: 'Event'
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  quantity: {
    type: Number,
    default: 1,
    trim: true
  },
  paymentInformation:{
    paymentDate: {
      type: Date
    },
    paymentAmount: {
      type: String
    },
    confirmationCode: {
      type: String
    },
  },
  person:{
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
    }
  },
  status: {
    type: String,
    default: 'pendiente',
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

EventRegistrationRequestSchema.plugin(mongoose_delete, {
  deletedAt: true,
  deletedBy: true
});
EventRegistrationRequestSchema.plugin(mongoose_delete, { indexFields: 'all' });
// Override all methods 
EventRegistrationRequestSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

autoIncrement.initialize(mongoose.connection);
EventRegistrationRequestSchema.plugin(autoIncrement.plugin, {
  model: 'EventRegistrationRequest',
  field: 'requestNumber',
  startAt: 1,
  incrementBy: 1
});
mongoose.model('EventRegistrationRequest', EventRegistrationRequestSchema);