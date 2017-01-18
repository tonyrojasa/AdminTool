//Eventpeoplegroups service used to communicate Eventpeoplegroups REST endpoints
(function() {
  'use strict';

  angular
    .module('eventpeoplegroups')
    .factory('EventpeoplegroupsService', EventpeoplegroupsService);

  EventpeoplegroupsService.$inject = ['$resource'];

  function EventpeoplegroupsService($resource) {
    return $resource('api/eventpeoplegroups/:eventpeoplegroupId', {
      eventpeoplegroupId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();