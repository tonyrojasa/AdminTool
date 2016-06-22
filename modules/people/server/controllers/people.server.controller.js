'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Person = mongoose.model('Person'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Person
 */
exports.create = function(req, res) {
  var person = new Person(req.body);
  person.user = req.user;

  person.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(person);
    }
  });
};

/**
 * Show the current Person
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var person = req.person ? req.person.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  person.isCurrentUserOwner = req.user && person.user && person.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(person);
};

/**
 * Update a Person
 */
exports.update = function(req, res) {
  var person = req.person;

  person = _.extend(person, req.body);

  person.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(person);
    }
  });
};

/**
 * Delete an Person
 */
exports.delete = function(req, res) {
  var person = req.person;

  person.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(person);
    }
  });
};

/**
 * List of People
 */
exports.list = function(req, res) {
  Person.find().sort('-created').populate('user', 'displayName').exec(function(err, people) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(people);
    }
  });
};

/**
 * Person middleware
 */
exports.personByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Person is invalid'
    });
  }

  Person.findById(id).populate('user', 'displayName').exec(function (err, person) {
    if (err) {
      return next(err);
    } else if (!person) {
      return res.status(404).send({
        message: 'No Person with that identifier has been found'
      });
    }
    req.person = person;
    next();
  });
};
