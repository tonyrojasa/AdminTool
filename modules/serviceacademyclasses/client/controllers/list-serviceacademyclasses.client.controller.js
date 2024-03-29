(function() {
  'use strict';

  angular
    .module('serviceacademyclasses')
    .controller('ServiceacademyclassesListController', ServiceacademyclassesListController);

  ServiceacademyclassesListController.$inject = ['$rootScope', '_', 'ServiceacademyclassesService', 'OrganizationsService'];

  function ServiceacademyclassesListController($rootScope, _, ServiceacademyclassesService, OrganizationsService) {
    var vm = this;

    $rootScope.showLoadingSpinner = true;
    vm.serviceacademyclasses = ServiceacademyclassesService.query(function() {
      $rootScope.showLoadingSpinner = false;
    }, function() {
      $rootScope.showLoadingSpinner = false;
    });

    vm.organizations = OrganizationsService.query();
    vm.getStatusClass = getStatusClass;
    vm.setOrganization = setOrganization;
    vm.parseSchedule = parseSchedule;

    function parseSchedule(sheduleArray) {
      _.forEach(sheduleArray,
        function(value, key) {
          switch (value) {
            case "L":
              sheduleArray[key] = "Lunes";
              break;
            case "K":
              sheduleArray[key] = "Martes";
              break;
            case "M":
              sheduleArray[key] = "Miercoles";
              break;
            case "J":
              sheduleArray[key] = "Jueves";
              break;
            case "V":
              sheduleArray[key] = "Viernes";
              break;
            case "S":
              sheduleArray[key] = "Sábado";
              break;
            case "D":
              sheduleArray[key] = "Domingo";
              break;
          }
        });
      var scheduleValue = sheduleArray.join(', ');
      return scheduleValue;
    }

    function setOrganization(organization) {
      vm.organization = organization;
    }

    function getStatusClass(serviceacademyclass) {
      var endDate = new Date(serviceacademyclass.endDate);
      var today = new Date();
      if (endDate > today) {
        return 'success';
      } else {
        return 'danger';
      }
    }

  }
})();