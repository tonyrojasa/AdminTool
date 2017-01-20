'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Assistance = mongoose.model('Assistance'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Assistance
 */
exports.create = function(req, res) {
  var assistance = new Assistance(req.body);
  assistance.user = req.user;

  assistance.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(assistance);
    }
  });
};

/**
 * Show the current Assistance
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var assistance = req.assistance ? req.assistance.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  assistance.isCurrentUserOwner = req.user && assistance.user && assistance.user._id.toString() === req.user._id.toString() ? true : false;
  res.jsonp(assistance);
};

/**
 * Update a Assistance
 */
exports.update = function(req, res) {
  var assistance = req.assistance;

  assistance = _.extend(assistance, req.body);

  assistance.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(assistance);
    }
  });
};

/**
 * Delete an Assistance
 */
exports.delete = function(req, res) {
  var assistance = req.assistance;

  assistance.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(assistance);
    }
  });
};

/**
 * List of Assistances
 */
exports.list = function(req, res) {
  Assistance.find().sort('-created')
    .populate('serviceAcademyClass', 'name')
    .populate('user', 'displayName').exec(function(err, assistances) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(assistances);
      }
    });
};

/**
 * Assistance middleware
 */
exports.assistanceByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Assistance is invalid'
    });
  }

  Assistance.findById(id)
    .populate('serviceAcademyClass')
    .populate('assistants.person')
    .populate({
      path: 'assistants.person',
      populate: {
        path: 'personType'
      }
    })
    .populate('user', 'displayName').exec(function(err, assistance) {
      if (err) {
        return next(err);
      } else if (!assistance) {
        return res.status(404).send({
          message: 'No Assistance with that identifier has been found'
        });
      }
      req.assistance = assistance;
      next();
    });
};