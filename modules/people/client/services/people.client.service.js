// People service used to communicate People REST endpoints
(function () {
  'use strict';

  angular
    .module('people')
    .factory('PeopleService', PeopleService);

  PeopleService.$inject = ['$resource'];

  function PeopleService($resource) {
    return $resource('api/people/:personId', {
      personId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
