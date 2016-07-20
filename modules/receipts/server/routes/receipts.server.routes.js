'use strict';

/**
 * Module dependencies
 */
var receiptsPolicy = require('../policies/receipts.server.policy'),
  receipts = require('../controllers/receipts.server.controller');

module.exports = function(app) {
  // Receipts Routes
  app.route('/api/receipts').all(receiptsPolicy.isAllowed)
    .get(receipts.list)
    .post(receipts.create);

  app.route('/api/receipts/:receiptId').all(receiptsPolicy.isAllowed)
    .get(receipts.read)
    .put(receipts.update)
    .delete(receipts.delete);

  // Finish by binding the Receipt middleware
  app.param('receiptId', receipts.receiptByID);
};
