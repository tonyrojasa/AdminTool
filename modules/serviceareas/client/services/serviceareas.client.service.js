//Serviceareas service used to communicate Serviceareas REST endpoints
(function () {
  'use strict';

  angular
    .module('serviceareas')
    .factory('ServiceareasService', ServiceareasService);

  ServiceareasService.$inject = ['$resource'];

  function ServiceareasService($resource) {
    return $resource('api/serviceareas/:serviceareaId', {
      serviceareaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
