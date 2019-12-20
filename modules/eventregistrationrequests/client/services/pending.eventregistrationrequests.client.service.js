// Current Eventregistrationrequests service used to communicate Eventregistrationrequests REST endpoints
(function() {
  'use strict';

  angular
    .module('eventregistrationrequests')
    .factory('PendingEventregistrationrequestsService', PendingEventregistrationrequestsService);

  PendingEventregistrationrequestsService.$inject = ['$resource'];

  function PendingEventregistrationrequestsService($resource) {
    return $resource('api/eventregistrationrequests/pending/:eventRegistrationRequestId', {
      eventregistrationId: '@_id'
    }, {
      query: {
        method: 'GET',
        isArray: true,
        cache: false
      },
      update: {
        method: 'PUT'
      },
      delete: {
        method: 'DELETE'
      }
    });
  }
})();