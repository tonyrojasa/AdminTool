// Eventregistrationrequests service used to communicate Eventregistrationrequests REST endpoints
(function() {
  'use strict';

  angular
    .module('eventregistrationrequests')
    .factory('EventregistrationrequestsByEventService', EventregistrationrequestsByEventService);

  EventregistrationrequestsByEventService.$inject = ['$resource'];

  function EventregistrationrequestsByEventService($resource) {
    return $resource('api/eventregistrationrequests/event/:eventId', {
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