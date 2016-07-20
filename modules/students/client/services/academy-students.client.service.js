//Students service used to communicate Students REST endpoints
(function() {
  'use strict';

  angular
    .module('students')
    .factory('AcademyStudentsService', AcademyStudentsService);

  AcademyStudentsService.$inject = ['$resource'];

  function AcademyStudentsService($resource) {
    return $resource('/api/serviceacademyclasses/:serviceacademyclassId/students', {
      serviceacademyclassId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();