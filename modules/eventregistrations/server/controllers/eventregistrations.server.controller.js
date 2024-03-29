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
  var query = _.forEach(req.query, function(value, key) {
    var queryParam = {
      $regex: new RegExp('^' + value + '$', "i"),
      $options: 'i'
    };
    req.query[key] = _.zipObject([key], [queryParam]);
  });

  if (!_.isEmpty(query)) {
    query = {
      $and: _.toArray(query)
    };
  }

  Eventregistration.find(query).sort('-created')
    .populate('user', 'displayName')
    .populate({
      path: 'person',
      populate: {
        path: 'personType'
      }
    })
    .populate('personType', 'name')
    .populate('event', 'name')
    .populate('eventPeopleGroup', 'name')
    .exec(function(err, eventregistrations) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {

        var shirtTypesList = [];
        _.each(eventregistrations, function(eventregistration, key) {
          if (eventregistration.shirtTypes.length > 0) {
            _.each(eventregistration.shirtTypes, function(shirtType) {
              shirtType.shirtSize = eventregistration.person.shirtSize;
            });
          }

          if (key === eventregistrations.length - 1) {
            eventregistrations.shirtTypesList = shirtTypesList;
            res.jsonp(eventregistrations);
          }
        });
      }
    });
};

/**
 * List of current Eventregistrations
 */
exports.listAllCurrent = function(req, res) {
  var query = _.forEach(req.query, function(value, key) {
    var queryParam = {
      $regex: new RegExp('^' + value + '$', "i"),
      $options: 'i'
    };
    req.query[key] = _.zipObject([key], [queryParam]);
  });

  if (!_.isEmpty(query)) {
    query = {
      $and: _.toArray(query)
    };
  }

  Eventregistration.find(query).sort('-created')
    .populate('user', 'displayName')
    .populate({
      path: 'person',
      populate: {
        path: 'personType'
      }
    })
    .populate('personType', 'name')
    .populate('event')
    .populate('eventPeopleGroup', 'name')
    .exec(function(err, eventregistrations) {
      eventregistrations = eventregistrations.filter(function(eventregistration) {
        return (eventregistration.event && (!eventregistration.event.ended || eventregistration.event.openEnrollment));
      });

      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {

        var shirtTypesList = [];
        _.each(eventregistrations, function(eventregistration, key) {
          if (eventregistration.shirtTypes.length > 0) {
            _.each(eventregistration.shirtTypes, function(shirtType) {
              shirtType.shirtSize = eventregistration.person.shirtSize;
            });
          }

          if (key === eventregistrations.length - 1) {
            eventregistrations.shirtTypesList = shirtTypesList;
            res.jsonp(eventregistrations);
          }
        });
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
    .populate('personType', 'name')
    .populate('event', 'name')
    .populate('eventPeopleGroup', 'name')
    .exec(function(err, eventregistrations) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var shirtTypesList = [];
        _.each(eventregistrations, function(eventregistration, key) {
          if (eventregistration.shirtTypes.length > 0) {
            _.each(eventregistration.shirtTypes, function(shirtType) {
              shirtType.shirtSize = eventregistration.person.shirtSize;
            });
          }

          if (key === eventregistrations.length - 1) {
            eventregistrations.shirtTypesList = shirtTypesList;
            res.jsonp(eventregistrations);
          }
        });
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
    .populate('personType', 'name')
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
    .populate('personType', 'name')
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