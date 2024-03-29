'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Events Permissions
 */
exports.invokeRolesPolicies = function() {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/events',
      permissions: '*'
    }, {
      resources: '/api/events/:eventId',
      permissions: '*'
    }, {
      resources: '/api/events/current',
      permissions: '*'
    }, {
      resources: '/api/events/current/:eventId',
      permissions: '*'
    }]
  }, {
    roles: ['inscriptor'],
    allows: [{
      resources: '/api/events',
      permissions: ['get', 'post', 'patch', 'put']
    }, {
      resources: '/api/events/:eventId',
      permissions: ['get', 'post', 'patch', 'put']
    }, {
      resources: '/api/events/current',
      permissions: ['get', 'post', 'patch', 'put']
    }, {
      resources: '/api/events/current/:eventId',
      permissions: ['get', 'post', 'patch', 'put']
    }]
  }, {
    roles: ['guest', 'user'],
    allows: [{
      resources: '/api/events',
      permissions: ['get']
    }, {
      resources: '/api/events/:eventId',
      permissions: ['get']
    }, {
      resources: '/api/events/current',
      permissions: ['get']
    }, {
      resources: '/api/events/current/:eventId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Events Policy Allows
 */
exports.isAllowed = function(req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Event is being processed and the current user created it then allow any manipulation
  if (req.event && req.user && req.event.user && req.event.user.id === req.user.id) {
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