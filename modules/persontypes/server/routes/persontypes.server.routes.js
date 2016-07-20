'use strict';

/**
 * Module dependencies
 */
var persontypesPolicy = require('../policies/persontypes.server.policy'),
  persontypes = require('../controllers/persontypes.server.controller');

module.exports = function(app) {
  // Persontypes Routes
  app.route('/api/persontypes').all(persontypesPolicy.isAllowed)
    .get(persontypes.list)
    .post(persontypes.create);

  app.route('/api/persontypes/:persontypeId').all(persontypesPolicy.isAllowed)
    .get(persontypes.read)
    .put(persontypes.update)
    .delete(persontypes.delete);

  // Finish by binding the Persontype middleware
  app.param('persontypeId', persontypes.persontypeByID);
};
