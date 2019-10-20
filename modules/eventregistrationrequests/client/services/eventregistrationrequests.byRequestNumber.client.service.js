// Eventregistrationrequests service used to communicate Eventregistrationrequests REST endpoints
(function() {
  'use strict';

  angular
    .module('eventregistrationrequests')
    .factory('EventregistrationrequestsServiceByRequestNumber', EventregistrationrequestsServiceByRequestNumber);

    EventregistrationrequestsServiceByRequestNumber.$inject = ['$resource'];

  function EventregistrationrequestsServiceByRequestNumber($resource) {
    return $resource('api/eventregistrationrequests/requestNumber/:requestNumber', {
      requestNumber: '@requestNumber'
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