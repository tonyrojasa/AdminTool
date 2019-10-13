// Eventregistrationrequests service used to communicate Eventregistrationrequests REST endpoints
(function() {
  'use strict';

  angular
    .module('eventregistrationrequests')
    .factory('EventregistrationrequestsService', EventregistrationrequestsService);

  EventregistrationrequestsService.$inject = ['$resource'];

  function EventregistrationrequestsService($resource) {
    return $resource('api/eventregistrationrequests/:eventregistrationrequestId', {
      eventregistrationrequestId: '@_id'
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