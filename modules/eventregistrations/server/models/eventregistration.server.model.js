'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var mongoose_delete = require('mongoose-delete');

/**
 * Eventregistration Schema
 */
var EventregistrationSchema = new Schema({
  registrationNumber: {
    type: Number
  },
  eventPeopleGroup: {
    type: Schema.ObjectId,
    ref: 'Eventpeoplegroup'
  },
  event: {
    type: Schema.ObjectId,
    ref: 'Event'
  },
  person: {
    type: Schema.ObjectId,
    ref: 'Person'
  },
  eventRegistrationRequest: {
    type: Schema.ObjectId,
    ref: 'EventRegistrationRequest'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  sponsorship: {
    sponsorRequired: Boolean,
    sponsor: {
      type: Schema.ObjectId,
      ref: 'Person'
    },
    percentage: Number,
    comments: String
  },
  assignedSector: {
    type: String,
    default: ''
  },
  balanceAmount: {
    type: Number,
    default: '',
    required: 'Please fill balance amount'
  },
  quantity: {
    type: Number,
    default: 1,
    trim: true
  },
  shirtsQuantity: {
    type: Number,
    default: 0,
    trim: true
  },
  shirtTypes: {
    type: Array
  },
  isEventServer: {
    type: Boolean,
    default: false,
    trim: true
  },
  eventExternalServer: {
    isEventExternalServer: {
      type: Boolean,
      default: false
    },
    specialPrice: {
      type: Number,
      default: 0
    }
  },
  personType: {
    type: Schema.ObjectId,
    ref: 'Persontype'
  },  
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    default: 'En cobro',
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

EventregistrationSchema.plugin(mongoose_delete, {
  deletedAt: true,
  deletedBy: true
});
EventregistrationSchema.plugin(mongoose_delete, { indexFields: 'all' });
// Override all methods 
EventregistrationSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

autoIncrement.initialize(mongoose.connection);
EventregistrationSchema.plugin(autoIncrement.plugin, {
  model: 'Eventregistration',
  field: 'registrationNumber',
  startAt: 1,
  incrementBy: 1
});
mongoose.model('Eventregistration', EventregistrationSchema);