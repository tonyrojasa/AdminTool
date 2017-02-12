// Eventregistrations service used to communicate Eventregistrations REST endpoints
(function() {
  'use strict';

  angular
    .module('eventregistrations')
    .factory('EventregistrationsService', EventregistrationsService);

  EventregistrationsService.$inject = ['$resource'];

  function EventregistrationsService($resource) {
    return $resource('api/eventregistrations/:eventregistrationId', {
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