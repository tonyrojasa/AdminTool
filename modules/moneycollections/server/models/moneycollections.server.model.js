'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var mongoose_delete = require('mongoose-delete');

/**
 * Moneycollection Schema
 */
var MoneycollectionSchema = new Schema({
  organization: {
    type: Schema.ObjectId,
    ref: 'Organization'
  },
  number: {
    type: Number
  },
  name: {
    type: String,
    trim: true,
    required: 'name cannot be blank'
  },
  date: {
    type: Date,
    default: Date.now
  },
  moneyFlows: [{
    type: {
      type: String,
      trim: true,
      required: 'type cannot be blank'
    },
    description: String,
    date: {
      type: Date,
      default: Date.now
    },
    isDetailed: {
      type: Boolean,
      default: true
    },
    isExpense: {
      type: Boolean,
      default: false
    },
    exchangeRate: Number,
    coins: {
      numberOf500: {
        type: Number,
        default: 0
      },
      numberOf100: {
        type: Number,
        default: 0
      },
      numberOf50: {
        type: Number,
        default: 0
      },
      numberOf25: {
        type: Number,
        default: 0
      },
      numberOf10: {
        type: Number,
        default: 0
      },
      numberOf5: {
        type: Number,
        default: 0
      }
    },
    bills: {
      numberOf50000: {
        type: Number,
        default: 0
      },
      numberOf20000: {
        type: Number,
        default: 0
      },
      numberOf10000: {
        type: Number,
        default: 0
      },
      numberOf5000: {
        type: Number,
        default: 0
      },
      numberOf2000: {
        type: Number,
        default: 0
      },
      numberOf1000: {
        type: Number,
        default: 0
      }
    },
    numberOfDollars: {
      type: Number,
      default: 0
    },
    collectors: [{
      type: Schema.ObjectId,
      ref: 'User'
    }],
    total: {
      type: Number,
      required: 'moneyFlowTotal cannot be blank'
    },
    comments: String
  }],
  reportedTotal: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: 'moneyCollectionTotal cannot be blank'
  },
  status: {
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

MoneycollectionSchema.plugin(mongoose_delete, {
  deletedAt: true,
  deletedBy: true
});
MoneycollectionSchema.plugin(mongoose_delete, { indexFields: 'all' });
// Override all methods 
MoneycollectionSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

autoIncrement.initialize(mongoose.connection);
MoneycollectionSchema.plugin(autoIncrement.plugin, {
  model: 'Moneycollection',
  field: 'number',
  startAt: 1,
  incrementBy: 1
});
mongoose.model('Moneycollection', MoneycollectionSchema);