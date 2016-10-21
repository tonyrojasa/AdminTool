// Eventregistrations service used to communicate Eventregistrations REST endpoints
(function() {
  'use strict';

  angular
    .module('eventregistrations')
    .factory('EventregistrationsByEventService', EventregistrationsByEventService);

  EventregistrationsByEventService.$inject = ['$resource'];

  function EventregistrationsByEventService($resource) {
    return $resource('api/eventregistrations/event/:eventId', {
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