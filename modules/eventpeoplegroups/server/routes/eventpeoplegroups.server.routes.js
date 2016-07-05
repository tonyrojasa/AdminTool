'use strict';

/**
 * Module dependencies
 */
var eventpeoplegroupsPolicy = require('../policies/eventpeoplegroups.server.policy'),
  eventpeoplegroups = require('../controllers/eventpeoplegroups.server.controller');

module.exports = function(app) {
  // Eventpeoplegroups Routes
  app.route('/api/eventpeoplegroups').all(eventpeoplegroupsPolicy.isAllowed)
    .get(eventpeoplegroups.list)
    .post(eventpeoplegroups.create);

  app.route('/api/eventpeoplegroups/:eventpeoplegroupId').all(eventpeoplegroupsPolicy.isAllowed)
    .get(eventpeoplegroups.read)
    .put(eventpeoplegroups.update)
    .delete(eventpeoplegroups.delete);

  // Finish by binding the Eventpeoplegroup middleware
  app.param('eventpeoplegroupId', eventpeoplegroups.eventpeoplegroupByID);
};
