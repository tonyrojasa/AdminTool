'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Serviceacademyclasses Permissions
 */
exports.invokeRolesPolicies = function() {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/serviceacademyclasses',
      permissions: '*'
    }, {
      resources: '/api/serviceacademyclasses/:serviceacademyclassId',
      permissions: '*'
    }, {
      resources: '/api/serviceacademyclasses/current',
      permissions: '*'
    }, {
      resources: '/api/serviceacademyclasses/current/:serviceacademyclassId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/serviceacademyclasses',
      permissions: ['get', 'post']
    }, {
      resources: '/api/serviceacademyclasses/:serviceacademyclassId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/serviceacademyclasses',
      permissions: ['get']
    }, {
      resources: '/api/serviceacademyclasses/:serviceacademyclassId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Serviceacademyclasses Policy Allows
 */
exports.isAllowed = function(req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Serviceacademyclass is being processed and the current user created it then allow any manipulation
  if (req.serviceacademyclass && req.user && req.serviceacademyclass.user && req.serviceacademyclass.user.id === req.user.id) {
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