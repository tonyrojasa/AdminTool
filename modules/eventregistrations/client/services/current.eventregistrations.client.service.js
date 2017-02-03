// Current Eventregistrations service used to communicate Eventregistrations REST endpoints
(function() {
  'use strict';

  angular
    .module('eventregistrations')
    .factory('CurrentEventregistrationsService', CurrentEventregistrationsService);

  CurrentEventregistrationsService.$inject = ['$resource'];

  function CurrentEventregistrationsService($resource) {
    return $resource('api/eventregistrations/current/:eventregistrationId', {
      eventregistrationId: '@_id'
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