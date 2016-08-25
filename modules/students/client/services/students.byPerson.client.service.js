// StudentsByPerson service used to communicate StudentsByPerson REST endpoints
(function() {
  'use strict';

  angular
    .module('eventregistrations')
    .factory('StudentsByPersonService', StudentsByPersonService);

  StudentsByPersonService.$inject = ['$resource'];

  function StudentsByPersonService($resource) {
    return $resource('api/students/person/:personId', {
      personId: '@personId'
    });
  }
})();