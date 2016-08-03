'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Students Permissions
 */
exports.invokeRolesPolicies = function() {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/students',
      permissions: '*'
    }, {
      resources: '/api/students/:studentId',
      permissions: '*'
    }, {
      resources: '/api/students/serviceacademyclass/:serviceacademyclassId',
      permissions: '*'
    }]
  }, {
    roles: ['teacher'],
    allows: [{
      resources: '/api/students',
      permissions: ['get', 'post', 'patch', 'put']
    }, {
      resources: '/api/students/:studentId',
      permissions: ['get', 'post', 'patch', 'put']
    }, {
      resources: '/api/students/serviceacademyclass/:serviceacademyclassId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest', 'user', 'student'],
    allows: [{
      resources: '/api/students',
      permissions: ['get']
    }, {
      resources: '/api/students/:studentId',
      permissions: ['get']
    }, {
      resources: '/api/students/serviceacademyclass/:serviceacademyclassId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Students Policy Allows
 */
exports.isAllowed = function(req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Student is being processed and the current user created it then allow any manipulation
  if (req.student && req.user && req.student.user && req.student.user.id === req.user.id) {
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