// students service used to communicate Students REST endpoints
(function() {
  'use strict';

  angular
    .module('students')
    .factory('StudentsByServiceAcademyClass', StudentsByServiceAcademyClass);

  StudentsByServiceAcademyClass.$inject = ['$resource'];

  function StudentsByServiceAcademyClass($resource) {
    return $resource('api/students/serviceacademyclass/:serviceacademyclassId', {
      serviceacademyclassId: '@serviceacademyclassId'
    });
  }
})();