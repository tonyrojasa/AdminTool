'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Receipt = mongoose.model('Receipt'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Receipt
 */
exports.create = function(req, res) {
  var receipt = new Receipt(req.body);
  receipt.user = req.user;

  receipt.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(receipt);
    }
  });
};

/**
 * Show the current Receipt
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var receipt = req.receipt ? req.receipt.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  receipt.isCurrentUserOwner = req.user && receipt.user && receipt.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(receipt);
};

/**
 * Update a Receipt
 */
exports.update = function(req, res) {
  var receipt = req.receipt;

  receipt = _.extend(receipt, req.body);

  receipt.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(receipt);
    }
  });
};

/**
 * Delete an Receipt
 */
exports.delete = function(req, res) {
  var receipt = req.receipt;

  receipt.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(receipt);
    }
  });
};

/**
 * List of Receipts
 */
exports.list = function(req, res) {
  Receipt.find().sort('-created')
    .populate('event')
    .populate({
      path: 'eventRegistration',
      populate: {
        path: 'event'
      }
    })
    .populate('user', 'displayName').exec(function(err, receipts) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(receipts);
      }
    });
};

/**
 * List of Receipts by EventRegistrationId
 */
exports.listByEventRegistrationId = function(req, res) {
  var eventRegistrationId = req.params.eventRegistrationId;
  Receipt.where('eventRegistration', eventRegistrationId).sort('-created')
    .populate('event')
    .populate({
      path: 'eventRegistration',
      populate: {
        path: 'event'
      }
    })
    .populate('user', 'displayName').exec(function(err, receipts) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(receipts);
      }
    });
};

/**
 * Receipt middleware
 */
exports.receiptByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Receipt is invalid'
    });
  }

  Receipt.findById(id).populate('user', 'displayName')
    .populate('event')
    .populate({
      path: 'eventRegistration',
      populate: {
        path: 'person'
      }
    })
    .populate({
      path: 'eventRegistration',
      populate: {
        path: 'event'
      }
    })
    .exec(function(err, receipt) {
      if (err) {
        return next(err);
      } else if (!receipt) {
        return res.status(404).send({
          message: 'No Receipt with that identifier has been found'
        });
      }
      req.receipt = receipt;
      next();
    });
};