// EventregistrationsByPerson service used to communicate Eventregistrations REST endpoints
(function() {
  'use strict';

  angular
    .module('eventregistrations')
    .factory('EventregistrationsByPersonService', EventregistrationsByPersonService);

  EventregistrationsByPersonService.$inject = ['$resource'];

  function EventregistrationsByPersonService($resource) {
    return $resource('api/eventregistrations/person/:personId', {
      personId: '@personId'
    });
  }
})();