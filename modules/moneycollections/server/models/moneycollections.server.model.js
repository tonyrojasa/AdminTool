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
  moneyFlow: [{
    type: {
      type: String,
      trim: true,
      required: 'type cannot be blank'
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
      totalOf500: {
        type: Number,
        default: 0
      },
      totalOf100: {
        type: Number,
        default: 0
      },
      totalOf50: {
        type: Number,
        default: 0
      },
      totalOf25: {
        type: Number,
        default: 0
      },
      totalOf10: {
        type: Number,
        default: 0
      },
      totalOf5: {
        type: Number,
        default: 0
      },
      totalOfDolars: {
        type: Number,
        default: 0
      },
      coinsTotal: {
        type: Number,
        default: 0
      }
    },  
    bills: {
      total50000: {
        type: Number,
        default: 0
      },
      total20000: {
        type: Number,
        default: 0
      },
      total10000: {
        type: Number,
        default: 0
      },
      total5000: {
        type: Number,
        default: 0
      },
      total2000: {
        type: Number,
        default: 0
      },
      total000: {
        type: Number,
        default: 0
      },
      billsTotal: {
        type: Number,
        default: 0
      }
    },
    total: {
      type: Number,
      required: 'moneyFlowTotal cannot be blank'
    },
    comments: String
  }],
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