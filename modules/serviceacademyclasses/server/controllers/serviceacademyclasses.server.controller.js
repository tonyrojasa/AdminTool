'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Serviceacademyclass = mongoose.model('Serviceacademyclass'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Serviceacademyclass
 */
exports.create = function(req, res) {
  var serviceacademyclass = new Serviceacademyclass(req.body);
  serviceacademyclass.user = req.user;

  serviceacademyclass.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(serviceacademyclass);
    }
  });
};

/**
 * Show the current Serviceacademyclass
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var serviceacademyclass = req.serviceacademyclass ? req.serviceacademyclass.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  serviceacademyclass.isCurrentUserOwner = req.user && serviceacademyclass.user && serviceacademyclass.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(serviceacademyclass);
};

/**
 * Update a Serviceacademyclass
 */
exports.update = function(req, res) {
  var serviceacademyclass = req.serviceacademyclass;

  serviceacademyclass = _.extend(serviceacademyclass, req.body);

  serviceacademyclass.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(serviceacademyclass);
    }
  });
};

/**
 * Delete an Serviceacademyclass
 */
exports.delete = function(req, res) {
  var serviceacademyclass = req.serviceacademyclass;

  serviceacademyclass.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(serviceacademyclass);
    }
  });
};

/**
 * List of Serviceacademyclasses
 */
exports.list = function(req, res) {
  Serviceacademyclass.find().sort('-created')
    .populate('organization', 'name')
    .populate('user', 'displayName')
    .exec(function(err, serviceacademyclasses) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(serviceacademyclasses);
      }
    });
};

/**
 * List of Current Serviceacademyclasses (startDate is >= Today)
 */
exports.listAllCurrent = function(req, res) {
  Serviceacademyclass.where('endDate').gte(new Date()).sort('-created').populate('user', 'displayName').exec(function(err, serviceacademyclasses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(serviceacademyclasses);
    }
  });
};

/**
 * Serviceacademyclass middleware
 */
exports.serviceacademyclassByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Serviceacademyclass is invalid'
    });
  }

  Serviceacademyclass.findById(id)
    .populate('organization', 'name')
    .populate('user', 'displayName')
    .exec(function(err, serviceacademyclass) {
      if (err) {
        return next(err);
      } else if (!serviceacademyclass) {
        return res.status(404).send({
          message: 'No Serviceacademyclass with that identifier has been found'
        });
      }
      req.serviceacademyclass = serviceacademyclass;
      next();
    });
};