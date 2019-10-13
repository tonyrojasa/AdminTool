// Current Eventregistrationrequests service used to communicate Eventregistrationrequests REST endpoints
(function() {
  'use strict';

  angular
    .module('eventregistrationrequests')
    .factory('CurrentEventregistrationsService', CurrentEventregistrationsService);

  CurrentEventregistrationsService.$inject = ['$resource'];

  function CurrentEventregistrationsService($resource) {
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