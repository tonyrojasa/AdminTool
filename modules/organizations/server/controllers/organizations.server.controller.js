'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Organization = mongoose.model('Organization'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Organization
 */
exports.create = function(req, res) {
  var organization = new Organization(req.body);
  organization.user = req.user;

  organization.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(organization);
    }
  });
};

/**
 * Show the current Organization
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var organization = req.organization ? req.organization.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  organization.isCurrentUserOwner = req.user && organization.user && organization.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(organization);
};

/**
 * Update a Organization
 */
exports.update = function(req, res) {
  var organization = req.organization;

  organization = _.extend(organization, req.body);

  organization.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(organization);
    }
  });
};

/**
 * Delete an Organization
 */
exports.delete = function(req, res) {
  var organization = req.organization;

  organization.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(organization);
    }
  });
};

/**
 * List of Organizations
 */
exports.list = function(req, res) { 
  Organization.find().sort('-created').populate('user', 'displayName').exec(function(err, organizations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(organizations);
    }
  });
};

/**
 * Organization middleware
 */
exports.organizationByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Organization is invalid'
    });
  }

  Organization.findById(id).populate('user', 'displayName').exec(function (err, organization) {
    if (err) {
      return next(err);
    } else if (!organization) {
      return res.status(404).send({
        message: 'No Organization with that identifier has been found'
      });
    }
    req.organization = organization;
    next();
  });
};
