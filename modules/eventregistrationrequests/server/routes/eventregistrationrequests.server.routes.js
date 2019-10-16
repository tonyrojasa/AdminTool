'use strict';

/**
 * Module dependencies
 */
var eventregistrationrequestsPolicy = require('../policies/eventregistrationrequests.server.policy'),
  eventregistrationrequests = require('../controllers/eventregistrationrequests.server.controller');

module.exports = function(app) {
  // eventregistrationrequests Routes
  app.route('/api/eventregistrationrequests').all(eventregistrationrequestsPolicy.isAllowed)
    .get(eventregistrationrequests.list)
    .post(eventregistrationrequests.create);

  app.route('/api/eventregistrationrequests/current').all(eventregistrationrequestsPolicy.isAllowed)
    .get(eventregistrationrequests.listAllPending);

  app.route('/api/eventregistrationrequests/current/:eventRegistrationRequestId').all(eventregistrationrequestsPolicy.isAllowed)
    .get(eventregistrationrequests.read)
    .put(eventregistrationrequests.update)
    .delete(eventregistrationrequests.delete);

  app.route('/api/eventregistrationrequests/:eventRegistrationRequestId').all(eventregistrationrequestsPolicy.isAllowed)
    .get(eventregistrationrequests.read)
    .put(eventregistrationrequests.update)
    .delete(eventregistrationrequests.delete);

  app.route('/api/eventregistrationrequests/event/:eventId').all(eventregistrationrequestsPolicy.isAllowed)
    .get(eventregistrationrequests.listByEventId);

  app.route('/api/eventregistrationrequests/person/:personId').all(eventregistrationrequestsPolicy.isAllowed)
    .get(eventregistrationrequests.listByPersonId);

  // Finish by binding the Eventregistration middleware
  app.param('eventRegistrationRequestId', eventregistrationrequests.eventRegistrationRequestByID);
};