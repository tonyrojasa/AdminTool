'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Persontype = mongoose.model('Persontype'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Persontype
 */
exports.create = function(req, res) {
  var persontype = new Persontype(req.body);
  persontype.user = req.user;

  persontype.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(persontype);
    }
  });
};

/**
 * Show the current Persontype
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var persontype = req.persontype ? req.persontype.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  persontype.isCurrentUserOwner = req.user && persontype.user && persontype.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(persontype);
};

/**
 * Update a Persontype
 */
exports.update = function(req, res) {
  var persontype = req.persontype;

  persontype = _.extend(persontype, req.body);

  persontype.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(persontype);
    }
  });
};

/**
 * Delete an Persontype
 */
exports.delete = function(req, res) {
  var persontype = req.persontype;

  persontype.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(persontype);
    }
  });
};

/**
 * List of Persontypes
 */
exports.list = function(req, res) {
  Persontype.find().sort('-created').populate('user', 'displayName').exec(function(err, persontypes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(persontypes);
    }
  });
};

/**
 * Persontype middleware
 */
exports.persontypeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Persontype is invalid'
    });
  }

  Persontype.findById(id).populate('user', 'displayName').exec(function(err, persontype) {
    if (err) {
      return next(err);
    } else if (!persontype) {
      return res.status(404).send({
        message: 'No Persontype with that identifier has been found'
      });
    }
    req.persontype = persontype;
    next();
  });
};