(function() {
  'use strict';

  angular
    .module('serviceacademyclasses')
    .controller('ServiceacademyclassesListController', ServiceacademyclassesListController);

  ServiceacademyclassesListController.$inject = ['_', 'ServiceacademyclassesService', 'OrganizationsService'];

  function ServiceacademyclassesListController(_, ServiceacademyclassesService, OrganizationsService) {
    var vm = this;
    vm.serviceacademyclasses = ServiceacademyclassesService.query();
    vm.organizations = OrganizationsService.query();
    vm.setOrganization = setOrganization;
    vm.parseSchedule = parseSchedule;

    function parseSchedule(sheduleArray) {
      _.forEach(sheduleArray,
        function(value, key) {
          debugger;
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

  }
})();