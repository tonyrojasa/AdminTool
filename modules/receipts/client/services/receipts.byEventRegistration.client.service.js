// ReceiptsByEventRegistrationService service used to communicate Eventregistrations REST by EventRegistrationService endpoints
(function() {
  'use strict';

  angular
    .module('eventregistrations')
    .factory('ReceiptsByEventRegistrationService', ReceiptsByEventRegistrationService);

  ReceiptsByEventRegistrationService.$inject = ['$resource'];

  function ReceiptsByEventRegistrationService($resource) {
    return $resource('api/receipts/eventregistration/:eventRegistrationId', {
      eventId: '@eventRegistrationId'
    });
  }
})();