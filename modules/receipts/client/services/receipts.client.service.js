//Receipts service used to communicate Receipts REST endpoints
(function () {
  'use strict';

  angular
    .module('receipts')
    .factory('ReceiptsService', ReceiptsService);

  ReceiptsService.$inject = ['$resource'];

  function ReceiptsService($resource) {
    return $resource('api/receipts/:receiptId', {
      receiptId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
