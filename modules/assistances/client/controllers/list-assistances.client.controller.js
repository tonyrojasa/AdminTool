(function() {
  'use strict';

  angular
    .module('assistances')
    .controller('AssistancesListController', AssistancesListController);

  AssistancesListController.$inject = ['AssistancesService', 'ServiceacademyclassesService', 'serviceacademyclassResolve'];

  function AssistancesListController(AssistancesService, ServiceacademyclassesService, serviceacademyclass) {
    var vm = this;
    vm.serviceAcademyClass = serviceacademyclass;
    vm.serviceAcademyClasses = ServiceacademyclassesService.query();
    vm.assistances = AssistancesService.query();

    vm.setServiceAcademyClass = setServiceAcademyClass;
    //set setServiceAcademyClass
    function setServiceAcademyClass(serviceAcademyClass) {
      vm.serviceAcademyClass = serviceAcademyClass;
    }

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