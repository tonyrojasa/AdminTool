'use strict';

/**
 * Module dependencies
 */
var serviceacademyclassesPolicy = require('../policies/serviceacademyclasses.server.policy'),
  serviceacademyclasses = require('../controllers/serviceacademyclasses.server.controller');

module.exports = function(app) {
  // Serviceacademyclasses Routes
  app.route('/api/serviceacademyclasses').all(serviceacademyclassesPolicy.isAllowed)
    .get(serviceacademyclasses.list)
    .post(serviceacademyclasses.create);

  app.route('/api/serviceacademyclasses/current').all(serviceacademyclassesPolicy.isAllowed)
    .get(serviceacademyclasses.listAllCurrent);

  app.route('/api/serviceacademyclasses/:serviceacademyclassId').all(serviceacademyclassesPolicy.isAllowed)
    .get(serviceacademyclasses.read)
    .put(serviceacademyclasses.update)
    .delete(serviceacademyclasses.delete);

  // Finish by binding the Serviceacademyclass middleware
  app.param('serviceacademyclassId', serviceacademyclasses.serviceacademyclassByID);
};