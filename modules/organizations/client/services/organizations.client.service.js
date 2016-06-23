//Organizations service used to communicate Organizations REST endpoints
(function () {
  'use strict';

  angular
    .module('organizations')
    .factory('OrganizationsService', OrganizationsService);

  OrganizationsService.$inject = ['$resource'];

  function OrganizationsService($resource) {
    return $resource('api/organizations/:organizationId', {
      organizationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
