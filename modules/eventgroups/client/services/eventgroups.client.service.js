//Eventgroups service used to communicate Eventgroups REST endpoints
(function () {
  'use strict';

  angular
    .module('eventgroups')
    .factory('EventgroupsService', EventgroupsService);

  EventgroupsService.$inject = ['$resource'];

  function EventgroupsService($resource) {
    return $resource('api/eventgroups/:eventgroupId', {
      eventgroupId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
