//CurrentServiceAcademyClassesService service used to communicate Events REST endpoints
(function() {
  'use strict';

  angular
    .module('events')
    .factory('CurrentServiceAcademyClassesService', CurrentServiceAcademyClassesService);

  CurrentServiceAcademyClassesService.$inject = ['$resource'];

  function CurrentServiceAcademyClassesService($resource) {
    return $resource('api/serviceacademyclasses/current/:serviceacademyclassId', {
      eventId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();