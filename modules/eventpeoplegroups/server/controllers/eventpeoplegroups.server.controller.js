'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Eventpeoplegroup = mongoose.model('Eventpeoplegroup'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Eventpeoplegroup
 */
exports.create = function(req, res) {
  var eventpeoplegroup = new Eventpeoplegroup(req.body);
  eventpeoplegroup.user = req.user;

  eventpeoplegroup.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(eventpeoplegroup);
    }
  });
};

/**
 * Show the current Eventpeoplegroup
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var eventpeoplegroup = req.eventpeoplegroup ? req.eventpeoplegroup.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  eventpeoplegroup.isCurrentUserOwner = req.user && eventpeoplegroup.user && eventpeoplegroup.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(eventpeoplegroup);
};

/**
 * Update a Eventpeoplegroup
 */
exports.update = function(req, res) {
  var eventpeoplegroup = req.eventpeoplegroup;

  eventpeoplegroup = _.extend(eventpeoplegroup, req.body);

  eventpeoplegroup.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(eventpeoplegroup);
    }
  });
};

/**
 * Delete an Eventpeoplegroup
 */
exports.delete = function(req, res) {
  var eventpeoplegroup = req.eventpeoplegroup;

  eventpeoplegroup.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(eventpeoplegroup);
    }
  });
};

/**
 * List of Eventpeoplegroups
 */
exports.list = function(req, res) { 
  Eventpeoplegroup.find().sort('-created').populate('user', 'displayName').exec(function(err, eventpeoplegroups) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(eventpeoplegroups);
    }
  });
};

/**
 * Eventpeoplegroup middleware
 */
exports.eventpeoplegroupByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Eventpeoplegroup is invalid'
    });
  }

  Eventpeoplegroup.findById(id).populate('user', 'displayName').exec(function (err, eventpeoplegroup) {
    if (err) {
      return next(err);
    } else if (!eventpeoplegroup) {
      return res.status(404).send({
        message: 'No Eventpeoplegroup with that identifier has been found'
      });
    }
    req.eventpeoplegroup = eventpeoplegroup;
    next();
  });
};
