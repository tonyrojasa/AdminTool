'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Receipts Permissions
 */
exports.invokeRolesPolicies = function() {
  acl.allow([{
    roles: ['admin', 'inscriptor'],
    allows: [{
      resources: '/api/receipts',
      permissions: '*'
    }, {
      resources: '/api/receipts/:receiptId',
      permissions: '*'
    }, {
      resources: '/api/receipts/eventregistration/:eventRegistrationId',
      permissions: '*'
    }, {
      resources: '/api/receipts/current',
      permissions: '*'
    }, {
      resources: '/api/receipts/current/:receiptId',
      permissions: '*'
    }, {
      resources: '/api/receipts/event/:eventId',
      permissions: '*'
    }]
  }, {
    roles: ['inscriptor'],
    allows: [{
      resources: '/api/receipts',
      permissions: ['get', 'post']
    }, {
      resources: '/api/receipts/:receiptId',
      permissions: ['get']
    }, {
      resources: '/api/receipts/eventregistration/:eventRegistrationId',
      permissions: ['get']
    }, {
      resources: '/api/receipts/current',
      permissions: ['get', 'post', 'patch', 'put']
    }, {
      resources: '/api/receipts/current/:receiptId',
      permissions: ['get', 'post', 'patch', 'put']
    }, {
      resources: '/api/receipts/event/:eventId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest', 'user', 'teacher', 'student'],
    allows: [{
      resources: '/api/receipts',
      permissions: ['get']
    }, {
      resources: '/api/receipts/:receiptId',
      permissions: ['get']
    }, {
      resources: '/api/receipts/eventregistration/:eventRegistrationId',
      permissions: ['get']
    }, {
      resources: '/api/receipts/current',
      permissions: ['get']
    }, {
      resources: '/api/receipts/current/:receiptId',
      permissions: ['get']
    }, {
      resources: '/api/receipts/event/:eventId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Receipts Policy Allows
 */
exports.isAllowed = function(req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Receipt is being processed and the current user created it then allow any manipulation
  if (req.receipt && req.user && req.receipt.user && req.receipt.user.id === req.user.id) {
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