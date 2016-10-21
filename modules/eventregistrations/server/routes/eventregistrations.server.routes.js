'use strict';

/**
 * Module dependencies
 */
var eventregistrationsPolicy = require('../policies/eventregistrations.server.policy'),
  eventregistrations = require('../controllers/eventregistrations.server.controller');

module.exports = function(app) {
  // Eventregistrations Routes
  app.route('/api/eventregistrations').all(eventregistrationsPolicy.isAllowed)
    .get(eventregistrations.list)
    .post(eventregistrations.create);

  app.route('/api/eventregistrations/:eventregistrationId').all(eventregistrationsPolicy.isAllowed)
    .get(eventregistrations.read)
    .put(eventregistrations.update)
    .delete(eventregistrations.delete);

  app.route('/api/eventregistrations/event/:eventId').all(eventregistrationsPolicy.isAllowed)
    .get(eventregistrations.listByEventId);

  app.route('/api/eventregistrations/person/:personId').all(eventregistrationsPolicy.isAllowed)
    .get(eventregistrations.listByPersonId);

  // Finish by binding the Eventregistration middleware
  app.param('eventregistrationId', eventregistrations.eventregistrationByID);
};