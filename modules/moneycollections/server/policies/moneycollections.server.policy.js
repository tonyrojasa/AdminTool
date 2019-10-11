'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Moneycollections Permissions
 */
exports.invokeRolesPolicies = function() {
  acl.allow([{
    roles: ['boardDirector'],
    allows: [{
      resources: '/api/moneycollections',
      permissions: '*'
    }, {
      resources: '/api/moneycollections/:moneycollectionId',
      permissions: '*'
    }, {
      resources: '/api/moneycollections/current',
      permissions: '*'
    }, {
      resources: '/api/moneycollections/current/:moneycollectionId',
      permissions: '*'
    }]
  }, {
    roles: ['boardReviewer'],
    allows: [{
      resources: '/api/moneycollections',
      permissions: ['get']
    }, {
      resources: '/api/moneycollections/:moneycollectionId',
      permissions: ['get']
    }, {
      resources: '/api/moneycollections/current',
      permissions: ['get']
    }, {
      resources: '/api/moneycollections/current/:moneycollectionId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Moneycollections Policy Allows
 */
exports.isAllowed = function(req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Moneycollection is being processed and the current user created it then allow any manipulation
  if (req.moneycollection && req.user && req.moneycollection.user && req.moneycollection.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function(err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};