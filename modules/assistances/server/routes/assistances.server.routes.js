'use strict';

/**
 * Module dependencies
 */
var assistancesPolicy = require('../policies/assistances.server.policy'),
  assistances = require('../controllers/assistances.server.controller');

module.exports = function(app) {
  // Assistances Routes
  app.route('/api/assistances').all(assistancesPolicy.isAllowed)
    .get(assistances.list)
    .post(assistances.create);

  app.route('/api/assistances/:assistanceId').all(assistancesPolicy.isAllowed)
    .get(assistances.read)
    .put(assistances.update)
    .delete(assistances.delete);

  // Finish by binding the Assistance middleware
  app.param('assistanceId', assistances.assistanceByID);
};
