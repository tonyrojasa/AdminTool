'use strict';

/**
 * Module dependencies
 */
var moneycollectionsPolicy = require('../policies/moneycollections.server.policy'),
  moneycollections = require('../controllers/moneycollections.server.controller');

module.exports = function(app) {
  // Moneycollections Routes
  app.route('/api/moneycollections').all(moneycollectionsPolicy.isAllowed)
    .get(moneycollections.list)
    .post(moneycollections.create);

  app.route('/api/moneycollections/current').all(moneycollectionsPolicy.isAllowed)
    .get(moneycollections.listAllCurrent);

  app.route('/api/moneycollections/current/:moneycollectionId').all(moneycollectionsPolicy.isAllowed)
    .get(moneycollections.read)
    .put(moneycollections.update)
    .delete(moneycollections.delete);

  app.route('/api/moneycollections/:moneycollectionId').all(moneycollectionsPolicy.isAllowed)
    .get(moneycollections.read)
    .put(moneycollections.update)
    .delete(moneycollections.delete);

  // Finish by binding the Moneycollection middleware
  app.param('moneycollectionId', moneycollections.moneycollectionByID);
};