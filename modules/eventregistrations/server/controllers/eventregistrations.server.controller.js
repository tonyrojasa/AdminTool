'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Eventregistration = mongoose.model('Eventregistration'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Eventregistration
 */
exports.create = function(req, res) {
  var eventregistration = new Eventregistration(req.body);
  eventregistration.user = req.user;

  eventregistration.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(eventregistration);
    }
  });
};

/**
 * Show the current Eventregistration
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var eventregistration = req.eventregistration ? req.eventregistration.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  eventregistration.isCurrentUserOwner = req.user && eventregistration.user && eventregistration.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(eventregistration);
};

/**
 * Update a Eventregistration
 */
exports.update = function(req, res) {
  var eventregistration = req.eventregistration;

  eventregistration = _.extend(eventregistration, req.body);

  eventregistration.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(eventregistration);
    }
  });
};

/**
 * Delete an Eventregistration
 */
exports.delete = function(req, res) {
  var eventregistration = req.eventregistration;

  eventregistration.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(eventregistration);
    }
  });
};

/**
 * List of Eventregistrations
 */
exports.list = function(req, res) {
  Eventregistration.find().sort('-created')
    .populate('user', 'displayName')
    .populate({
      path: 'person',
      populate: {
        path: 'personType'
      }
    })
    .populate('event', 'name')
    .populate('eventPeopleGroup', 'name')
    .exec(function(err, eventregistrations) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(eventregistrations);
      }
    });
};

/**
 * List of Eventregistrations by eventId
 */
exports.listByEventId = function(req, res) {
  var eventId = req.params.eventId;
  Eventregistration.where('event', eventId).sort('-created')
    .populate('user', 'displayName')
    .populate({
      path: 'person',
      populate: {
        path: 'personType'
      }
    })
    .populate('event', 'name')
    .populate('eventPeopleGroup', 'name')
    .exec(function(err, eventregistrations) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(eventregistrations);
      }
    });
};

/**
 * List of Eventregistrations by personId
 */
exports.listByPersonId = function(req, res) {
  var personId = req.params.personId;
  Eventregistration.where('person', personId).sort('-created')
    .populate('user', 'displayName')
    .populate({
      path: 'person',
      populate: {
        path: 'personType'
      }
    })
    .populate('event', 'name')
    .populate('eventPeopleGroup', 'name')
    .exec(function(err, eventregistrations) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(eventregistrations);
      }
    });
};

/**
 * Eventregistration middleware
 */
exports.eventregistrationByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Eventregistration is invalid'
    });
  }

  Eventregistration.findById(id).populate('user', 'displayName')
    .populate('organization')
    .populate({
      path: 'person',
      populate: {
        path: 'personType'
      }
    })
    .populate('event')
    .populate('eventPeopleGroup')
    .exec(function(err, eventregistration) {
      if (err) {
        return next(err);
      } else if (!eventregistration) {
        return res.status(404).send({
          message: 'No Eventregistration with that identifier has been found'
        });
      }
      req.eventregistration = eventregistration;
      next();
    });
};