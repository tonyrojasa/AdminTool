// ServiceacademyclassesByPerson service used to communicate ServiceacademyclassesByPerson REST endpoints
(function() {
  'use strict';

  angular
    .module('eventregistrations')
    .factory('ServiceacademyclassesByPersonService', ServiceacademyclassesByPersonService);

  ServiceacademyclassesByPersonService.$inject = ['$resource'];

  function ServiceacademyclassesByPersonService($resource) {
    return $resource('api/serviceacademyclasses/person/:personId', {
      personId: '@personId'
    });
  }
})();