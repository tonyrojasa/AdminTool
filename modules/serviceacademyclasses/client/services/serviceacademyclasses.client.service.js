//Serviceacademyclasses service used to communicate Serviceacademyclasses REST endpoints
(function() {
  'use strict';

  angular
    .module('serviceacademyclasses')
    .factory('ServiceacademyclassesService', ServiceacademyclassesService);

  ServiceacademyclassesService.$inject = ['$resource'];

  function ServiceacademyclassesService($resource) {
    return $resource('api/serviceacademyclasses/:serviceacademyclassId', {
      serviceacademyclassId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();