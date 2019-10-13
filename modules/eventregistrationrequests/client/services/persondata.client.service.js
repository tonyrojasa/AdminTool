// Eventregistrationrequests service used to communicate Eventregistrationrequests REST endpoints
(function() {
  'use strict';

  angular
    .module('eventregistrations')
    .factory('PeopleDataService', PeopleDataService);

    PeopleDataService.$inject = ['$http'];

  function PeopleDataService($http) {
    return function getDataByIdOrWords(param) {
      return $http({
        url: `https://apis.gometa.org/cedulas/${param}`,
        method: 'GET',
        params: {key: 'kulbewXUrRGXKDl'}
      })
    };
  }
})();