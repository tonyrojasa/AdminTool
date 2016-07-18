'use strict';

/**
 * Module dependencies
 */
var Policy = require('../policies/.server.policy'),
   = require('../controllers/.server.controller');

module.exports = function(app) {
  //  Routes
  app.route('/api/').all(Policy.isAllowed)
    .get(.list)
    .post(.create);

  app.route('/api//:Id').all(Policy.isAllowed)
    .get(.read)
    .put(.update)
    .delete(.delete);

  // Finish by binding the  middleware
  app.param('Id', .ByID);
};
