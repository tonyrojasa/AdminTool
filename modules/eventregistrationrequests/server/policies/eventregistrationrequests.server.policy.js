'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke eventregistrationrequests Permissions
 */
exports.invokeRolesPolicies = function() {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/eventregistrationrequests',
      permissions: '*'
    }, {
      resources: '/api/eventregistrationrequests/:eventRegistrationRequestId',
      permissions: '*'
    }, {
      resources: '/api/eventregistrationrequests/event/:eventId',
      permissions: '*'
    }, {
      resources: '/api/eventregistrationrequests/person/:personId',
      permissions: '*'
    }, {
      resources: '/api/eventregistrationrequests/current',
      permissions: '*'
    }, {
      resources: '/api/eventregistrationrequests/current/:eventRegistrationRequestId',
      permissions: '*'
    }]
  }, {
    roles: ['inscriptor'],
    allows: [{
      resources: '/api/eventregistrationrequests',
      permissions: ['get', 'post', 'patch', 'put']
    }, {
      resources: '/api/eventregistrationrequests/:eventRegistrationRequestId',
      permissions: ['get', 'post', 'patch', 'put']
    }, {
      resources: '/api/eventregistrationrequests/event/:eventId',
      permissions: ['get']
    }, {
      resources: '/api/eventregistrationrequests/event/:eventId',
      permissions: ['get']
    }, {
      resources: '/api/eventregistrationrequests/current',
      permissions: ['get', 'post', 'patch', 'put']
    }, {
      resources: '/api/eventregistrationrequests/current/:eventRegistrationRequestId',
      permissions: ['get', 'post', 'patch', 'put']
    }]
  }, {
    roles: ['guest', 'user', 'teacher', 'student'],
    allows: [{
      resources: '/api/eventregistrationrequests',
      permissions: ['get']
    }, {
      resources: '/api/eventregistrationrequests/:eventRegistrationRequestId',
      permissions: ['get']
    }, {
      resources: '/api/eventregistrationrequests/event/:eventId',
      permissions: ['get']
    }, {
      resources: '/api/eventregistrationrequests/person/:personId',
      permissions: ['get']
    }, {
      resources: '/api/eventregistrationrequests/current',
      permissions: ['get']
    }, {
      resources: '/api/eventregistrationrequests/current/:eventRegistrationRequestId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If eventregistrationrequests Policy Allows
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