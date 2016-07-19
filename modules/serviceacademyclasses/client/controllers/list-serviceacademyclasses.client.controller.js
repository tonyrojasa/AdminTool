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
      var scheduleValue = sheduleArray.join(', ');
      scheduleValue = scheduleValue.replace('L', 'Lunes');
      scheduleValue = scheduleValue.replace('K', 'Martes');
      scheduleValue = scheduleValue.replace('M', 'Miercoles');
      scheduleValue = scheduleValue.replace('J', 'Jueves');
      scheduleValue = scheduleValue.replace('V', 'Viernes');
      scheduleValue = scheduleValue.replace('S', 'Sábado');
      scheduleValue = scheduleValue.replace('D', 'Domingo');

      return scheduleValue;
    }

    function setOrganization(organization) {
      vm.organization = organization;
    }

  }
})();