// Current Moneycollections service used to communicate Moneycollections REST endpoints
(function() {
  'use strict';

  angular
    .module('moneycollections')
    .factory('CurrentMoneycollectionsService', CurrentMoneycollectionsService);

  CurrentMoneycollectionsService.$inject = ['$resource'];

  function CurrentMoneycollectionsService($resource) {
    return $resource('api/moneycollections/current/:moneycollectionId', {
      moneycollectionId: '@_id'
    }, {
      query: {
        method: 'GET',
        isArray: true,
        cache: false
      },
      update: {
        method: 'PUT'
      },
      delete: {
        method: 'DELETE'
      }
    });
  }
})();