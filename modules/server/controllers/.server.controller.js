'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
   = mongoose.model(''),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a 
 */
exports.create = function(req, res) {
  var  = new (req.body);
  .user = req.user;

  .save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp();
    }
  });
};

/**
 * Show the current 
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var  = req. ? req..toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  .isCurrentUserOwner = req.user && .user && .user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp();
};

/**
 * Update a 
 */
exports.update = function(req, res) {
  var  = req. ;

   = _.extend( , req.body);

  .save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp();
    }
  });
};

/**
 * Delete an 
 */
exports.delete = function(req, res) {
  var  = req. ;

  .remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp();
    }
  });
};

/**
 * List of 
 */
exports.list = function(req, res) { 
  .find().sort('-created').populate('user', 'displayName').exec(function(err, ) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp();
    }
  });
};

/**
 *  middleware
 */
exports.ByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: ' is invalid'
    });
  }

  .findById(id).populate('user', 'displayName').exec(function (err, ) {
    if (err) {
      return next(err);
    } else if (!) {
      return res.status(404).send({
        message: 'No  with that identifier has been found'
      });
    }
    req. = ;
    next();
  });
};
