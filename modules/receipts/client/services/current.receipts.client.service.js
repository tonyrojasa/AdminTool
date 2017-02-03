//Current Receipts service used to communicate Receipts REST endpoints
(function() {
  'use strict';

  angular
    .module('receipts')
    .factory('CurrentReceiptsService', CurrentReceiptsService);

  CurrentReceiptsService.$inject = ['$resource'];

  function CurrentReceiptsService($resource) {
    return $resource('api/receipts/current/:receiptId', {
      receiptId: '@_id'
    }, {
      query: {
        method: 'GET',
        isArray: true,
        cache: false
      },
      update: {
        method: 'PUT'
      }
    });
  }
})();