// service used to communicate  REST endpoints
(function () {
  'use strict';

  angular
    .module('')
    .factory('Service', Service);

  Service.$inject = ['$resource'];

  function Service($resource) {
    return $resource('api//:Id', {
      Id: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
