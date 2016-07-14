//Events service used to communicate Events REST endpoints
(function() {
  'use strict';

  angular
    .module('events')
    .factory('CurrentEventsService', CurrentEventsService);

  CurrentEventsService.$inject = ['$resource'];

  function CurrentEventsService($resource) {
    return $resource('api/events/current/:eventId', {
      eventId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();