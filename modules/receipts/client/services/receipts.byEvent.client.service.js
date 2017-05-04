// Eventregistrations service used to communicate Eventregistrations REST endpoints
(function() {
  'use strict';

  angular
    .module('receipts')
    .factory('ReceiptsByEventService', ReceiptsByEventService);

  ReceiptsByEventService.$inject = ['$resource'];

  function ReceiptsByEventService($resource) {
    return $resource('api/receipts/event/:eventId', {
      eventId: '@eventId'
    }, {
      query: {
        method: 'GET',
        isArray: true,
        cache: false
      }
    });
  }
})();