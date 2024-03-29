'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Eventregistrations Permissions
 */
exports.invokeRolesPolicies = function() {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/eventregistrations',
      permissions: '*'
    }, {
      resources: '/api/eventregistrations/:eventregistrationId',
      permissions: '*'
    }, {
      resources: '/api/eventregistrations/event/:eventId',
      permissions: '*'
    }, {
      resources: '/api/eventregistrations/person/:personId',
      permissions: '*'
    }, {
      resources: '/api/eventregistrations/current',
      permissions: '*'
    }, {
      resources: '/api/eventregistrations/current/:eventregistrationId',
      permissions: '*'
    }]
  }, {
    roles: ['inscriptor'],
    allows: [{
      resources: '/api/eventregistrations',
      permissions: ['get', 'post', 'patch', 'put']
    }, {
      resources: '/api/eventregistrations/:eventregistrationId',
      permissions: ['get', 'post', 'patch', 'put']
    }, {
      resources: '/api/eventregistrations/event/:eventId',
      permissions: ['get']
    }, {
      resources: '/api/eventregistrations/event/:eventId',
      permissions: ['get']
    }, {
      resources: '/api/eventregistrations/current',
      permissions: ['get', 'post', 'patch', 'put']
    }, {
      resources: '/api/eventregistrations/current/:eventregistrationId',
      permissions: ['get', 'post', 'patch', 'put']
    }]
  }, {
    roles: ['guest', 'user', 'teacher', 'student'],
    allows: [{
      resources: '/api/eventregistrations',
      permissions: ['get']
    }, {
      resources: '/api/eventregistrations/:eventregistrationId',
      permissions: ['get']
    }, {
      resources: '/api/eventregistrations/event/:eventId',
      permissions: ['get']
    }, {
      resources: '/api/eventregistrations/person/:personId',
      permissions: ['get']
    }, {
      resources: '/api/eventregistrations/current',
      permissions: ['get']
    }, {
      resources: '/api/eventregistrations/current/:eventregistrationId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Eventregistrations Policy Allows
 */
exports.isAllowed = function(req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Eventregistration is being processed and the current user created it then allow any manipulation
  if (req.eventregistration && req.user && req.eventregistration.user && req.eventregistration.user.id === req.user.id) {
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