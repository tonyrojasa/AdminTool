'use strict';

/**
 * Module dependencies
 */
var eventgroupsPolicy = require('../policies/eventgroups.server.policy'),
  eventgroups = require('../controllers/eventgroups.server.controller');

module.exports = function(app) {
  // Eventgroups Routes
  app.route('/api/eventgroups').all(eventgroupsPolicy.isAllowed)
    .get(eventgroups.list)
    .post(eventgroups.create);

  app.route('/api/eventgroups/:eventgroupId').all(eventgroupsPolicy.isAllowed)
    .get(eventgroups.read)
    .put(eventgroups.update)
    .delete(eventgroups.delete);

  // Finish by binding the Eventgroup middleware
  app.param('eventgroupId', eventgroups.eventgroupByID);
};
