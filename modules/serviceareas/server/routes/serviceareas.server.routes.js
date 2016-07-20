'use strict';

/**
 * Module dependencies
 */
var serviceareasPolicy = require('../policies/serviceareas.server.policy'),
  serviceareas = require('../controllers/serviceareas.server.controller');

module.exports = function(app) {
  // Serviceareas Routes
  app.route('/api/serviceareas').all(serviceareasPolicy.isAllowed)
    .get(serviceareas.list)
    .post(serviceareas.create);

  app.route('/api/serviceareas/:serviceareaId').all(serviceareasPolicy.isAllowed)
    .get(serviceareas.read)
    .put(serviceareas.update)
    .delete(serviceareas.delete);

  // Finish by binding the Servicearea middleware
  app.param('serviceareaId', serviceareas.serviceareaByID);
};
