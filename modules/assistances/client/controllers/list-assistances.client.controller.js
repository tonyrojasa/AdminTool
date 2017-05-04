(function() {
  'use strict';

  angular
    .module('assistances')
    .controller('AssistancesListController', AssistancesListController);

  AssistancesListController.$inject = ['$rootScope', 'AssistancesService', 'ServiceacademyclassesService',
    'serviceacademyclassResolve'
  ];

  function AssistancesListController($rootScope, AssistancesService, ServiceacademyclassesService,
    serviceacademyclass) {
    var vm = this;
    vm.serviceAcademyClass = serviceacademyclass;
    vm.serviceAcademyClasses = ServiceacademyclassesService.query();

    $rootScope.showLoadingSpinner = true;
    vm.assistances = AssistancesService.query(function() {
      $rootScope.showLoadingSpinner = false;
    }, function() {
      $rootScope.showLoadingSpinner = false;
    });

    vm.getStatusClass = getStatusClass;

    function getStatusClass(assistance) {
      if (assistance.serviceAcademyClass) {
        return 'info';
      } else {
        return 'success';
      }
    }
  }
})();