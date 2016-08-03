//Assistances service used to communicate Assistances REST endpoints
(function () {
  'use strict';

  angular
    .module('assistances')
    .factory('AssistancesService', AssistancesService);

  AssistancesService.$inject = ['$resource'];

  function AssistancesService($resource) {
    return $resource('api/assistances/:assistanceId', {
      assistanceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
