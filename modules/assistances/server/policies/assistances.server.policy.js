'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Assistances Permissions
 */
exports.invokeRolesPolicies = function() {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/assistances',
      permissions: '*'
    }, {
      resources: '/api/assistances/:assistanceId',
      permissions: '*'
    }]
  }, {
    roles: ['teacher'],
    allows: [{
      resources: '/api/assistances',
      permissions: ['get', 'post', 'patch', 'put']
    }, {
      resources: '/api/assistances/:assistanceId',
      permissions: ['get', 'post', 'patch', 'put']
    }]
  }, {
    roles: ['guest', 'user', 'student'],
    allows: [{
      resources: '/api/assistances',
      permissions: ['get']
    }, {
      resources: '/api/assistances/:assistanceId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Assistances Policy Allows
 */
exports.isAllowed = function(req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Assistance is being processed and the current user created it then allow any manipulation
  if (req.assistance && req.user && req.assistance.user && req.assistance.user.id === req.user.id) {
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