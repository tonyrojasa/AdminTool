'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  EventRegistrationRequest = mongoose.model('EventRegistrationRequest'),
  Event = mongoose.model('Event'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a EventRegistrationRequest
 */
exports.create = function (req, res) {
  var eventRegistrationRequest = new EventRegistrationRequest(req.body);
  eventRegistrationRequest.user = req.user;

  eventRegistrationRequest.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(eventRegistrationRequest);
    }
  });
};

/**
 * Show the current EventRegistrationRequest
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var eventRegistrationRequest = req.eventRegistrationRequest ? req.eventRegistrationRequest.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  eventRegistrationRequest.isCurrentUserOwner = req.user && eventRegistrationRequest.user && eventRegistrationRequest.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(eventRegistrationRequest);
};

/**
 * Update a EventRegistrationRequest
 */
exports.update = function (req, res) {
  var eventRegistrationRequest = req.eventRegistrationRequest;

  eventRegistrationRequest = _.extend(eventRegistrationRequest, req.body);

  eventRegistrationRequest.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(eventRegistrationRequest);
    }
  });
};

/**
 * Delete an EventRegistrationRequest
 */
exports.delete = function (req, res) {
  var eventRegistrationRequest = req.eventRegistrationRequest;
  var idUser = req.user;

  eventRegistrationRequest.delete(idUser, function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(eventRegistrationRequest);
    }
  });
};

/**
 * List of EventRegistrationRequests
 */
exports.list = function (req, res) {
  var query = _.forEach(req.query, function (value, key) {
    var queryParam = {
      $regex: new RegExp('^' + value + '$', 'i'),
      $options: 'i'
    };
    req.query[key] = _.zipObject([key], [queryParam]);
  });

  if (!_.isEmpty(query)) {
    query = {
      $and: _.toArray(query)
    };
  }

  EventRegistrationRequest.find(query).sort('-created')
    .populate('user', 'displayName')
    .populate('personType', 'name')
    .populate('event', 'name')
    .where('deleted', false)
    .exec(function (err, eventRegistrationRequests) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(eventRegistrationRequests);
      }
    });
};

/**
 * List of AllPending EventRegistrationRequests
 */
exports.listAllPending = function (req, res) {
  var query = _.forEach(req.query, function (value, key) {
    var queryParam = {
      $regex: new RegExp('^' + value + '$', 'i'),
      $options: 'i'
    };
    req.query[key] = _.zipObject([key], [queryParam]);
  });

  if (!_.isEmpty(query)) {
    query = {
      $and: _.toArray(query)
    };
  }

  Event.find({
    $or: [
      { 'status': 'pendiente' }
    ]
  }).exec(function (err, events) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      EventRegistrationRequest.find(query).find({ event: { $in: events } }).sort('-created')
        .populate('user', 'displayName')
        .populate('personType', 'name')
        .populate('event', 'name')
        .where('deleted', false)
        .exec(function (err, eventRegistrationRequests) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(eventRegistrationRequests);
          }
        });
    }
  });
};

/**
 * List of EventRegistrationRequests by eventId
 */
exports.listByEventId = function (req, res) {
  var eventId = req.params.eventId;
  EventRegistrationRequest.where('event', eventId).sort('-created')
    .populate('user', 'displayName')
    .populate('personType', 'name')
    .populate('event', 'name')
    .where('deleted', false)
    .exec(function (err, eventRegistrationRequests) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var shirtTypesList = [];
        if (eventRegistrationRequests.length > 0) {
          _.each(eventRegistrationRequests, function (eventRegistrationRequest, key) {
            if (eventRegistrationRequest.shirtTypes.length > 0) {
              _.each(eventRegistrationRequest.shirtTypes, function (shirtType) {
                shirtType.shirtSize = eventRegistrationRequest.person.shirtSize;
              });
            }

            if (key === eventRegistrationRequests.length - 1) {
              eventRegistrationRequests.shirtTypesList = shirtTypesList;
              res.jsonp(eventRegistrationRequests);
            }
          });
        } else {
          res.jsonp(eventRegistrationRequests);
        }
      }
    });
};

/**
 * List of EventRegistrationRequests by personId
 */
exports.listByPersonId = function (req, res) {
  var personId = req.params.personId;
  EventRegistrationRequest.where('person', personId).sort('-created')
    .populate('user', 'displayName')
    .populate('personType', 'name')
    .populate('event', 'name')
    .where('deleted', false)
    .exec(function (err, eventRegistrationRequests) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(eventRegistrationRequests);
      }
    });
};

/**
 * EventRegistrationRequest middleware
 */
exports.eventRegistrationRequestByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'EventRegistrationRequest is invalid'
    });
  }

  EventRegistrationRequest.findById(id)
    .populate('user', 'displayName')
    .populate('personType', 'name')
    .populate('event', 'name')
    .where('deleted', false)
    .exec(function (err, eventRegistrationRequest) {
      if (err) {
        return next(err);
      } else if (!eventRegistrationRequest) {
        return res.status(404).send({
          message: 'No EventRegistrationRequest with that identifier has been found'
        });
      }
      req.eventRegistrationRequest = eventRegistrationRequest;
      next();
    });
};