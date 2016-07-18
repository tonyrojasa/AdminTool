'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Servicearea = mongoose.model('Servicearea'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Servicearea
 */
exports.create = function(req, res) {
  var servicearea = new Servicearea(req.body);
  servicearea.user = req.user;

  servicearea.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(servicearea);
    }
  });
};

/**
 * Show the current Servicearea
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var servicearea = req.servicearea ? req.servicearea.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  servicearea.isCurrentUserOwner = req.user && servicearea.user && servicearea.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(servicearea);
};

/**
 * Update a Servicearea
 */
exports.update = function(req, res) {
  var servicearea = req.servicearea;

  servicearea = _.extend(servicearea, req.body);

  servicearea.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(servicearea);
    }
  });
};

/**
 * Delete an Servicearea
 */
exports.delete = function(req, res) {
  var servicearea = req.servicearea;

  servicearea.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(servicearea);
    }
  });
};

/**
 * List of Serviceareas
 */
exports.list = function(req, res) {
  Servicearea.find().sort('-created').populate('user', 'displayName').exec(function(err, serviceareas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(serviceareas);
    }
  });
};

/**
 * Servicearea middleware
 */
exports.serviceareaByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Servicearea is invalid'
    });
  }

  Servicearea.findById(id).populate('user', 'displayName').exec(function(err, servicearea) {
    if (err) {
      return next(err);
    } else if (!servicearea) {
      return res.status(404).send({
        message: 'No Servicearea with that identifier has been found'
      });
    }
    req.servicearea = servicearea;
    next();
  });
};