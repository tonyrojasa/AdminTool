//Persontypes service used to communicate Persontypes REST endpoints
(function() {
  'use strict';

  angular
    .module('persontypes')
    .factory('PersontypesService', PersontypesService);

  PersontypesService.$inject = ['$resource'];

  function PersontypesService($resource) {
    return $resource('api/persontypes/:persontypeId', {
      persontypeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();