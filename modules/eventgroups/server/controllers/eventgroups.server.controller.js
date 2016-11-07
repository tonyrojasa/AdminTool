'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Eventgroup = mongoose.model('Eventgroup'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Eventgroup
 */
exports.create = function(req, res) {
  var eventgroup = new Eventgroup(req.body);
  eventgroup.user = req.user;

  eventgroup.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(eventgroup);
    }
  });
};

/**
 * Show the current Eventgroup
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var eventgroup = req.eventgroup ? req.eventgroup.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  eventgroup.isCurrentUserOwner = req.user && eventgroup.user && eventgroup.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(eventgroup);
};

/**
 * Update a Eventgroup
 */
exports.update = function(req, res) {
  var eventgroup = req.eventgroup;

  eventgroup = _.extend(eventgroup, req.body);

  eventgroup.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(eventgroup);
    }
  });
};

/**
 * Delete an Eventgroup
 */
exports.delete = function(req, res) {
  var eventgroup = req.eventgroup;

  eventgroup.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(eventgroup);
    }
  });
};

/**
 * List of Eventgroups
 */
exports.list = function(req, res) {
  Eventgroup.find().sort('-created').populate('user', 'displayName').exec(function(err, eventgroups) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(eventgroups);
    }
  });
};

/**
 * Eventgroup middleware
 */
exports.eventgroupByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Eventgroup is invalid'
    });
  }

  Eventgroup.findById(id).populate('user', 'displayName').exec(function(err, eventgroup) {
    if (err) {
      return next(err);
    } else if (!eventgroup) {
      return res.status(404).send({
        message: 'No Eventgroup with that identifier has been found'
      });
    }
    req.eventgroup = eventgroup;
    next();
  });
};