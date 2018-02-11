// Moneycollections service used to communicate Moneycollections REST endpoints
(function() {
  'use strict';

  angular
    .module('moneycollections')
    .factory('MoneycollectionsService', MoneycollectionsService);

  MoneycollectionsService.$inject = ['$resource'];

  function MoneycollectionsService($resource) {
    return $resource('api/moneycollections/:moneycollectionId', {
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