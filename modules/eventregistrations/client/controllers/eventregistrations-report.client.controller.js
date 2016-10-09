(function() {
  'use strict';

  angular
    .module('eventregistrations')
    .controller('EventregistrationsReportController', EventregistrationsReportController);

  EventregistrationsReportController.$inject = ['$scope', 'EventregistrationsService',
    'EventsService', 'EventpeoplegroupsService', 'PersontypesService'
  ];

  function EventregistrationsReportController($scope, EventregistrationsService, EventsService,
    EventpeoplegroupsService, PersontypesService) {
    var vm = this;
    vm.events = EventsService.query();
    vm.eventregistrations = EventregistrationsService.query();
    vm.eventPeopleGroups = EventpeoplegroupsService.query();
    vm.personTypes = PersontypesService.query();
    init();

    function init() {}

    vm.getTotalClass = function(value) {
      if (value >= 0) {
        return 'success';
      } else {
        return 'danger';
      }
    };

    vm.hasPendingPayment = function(eventRegistration) {
      return eventRegistration.balanceAmount > 0;
    };

    vm.getStatusClass = function(eventRegistration) {
      return vm.hasPendingPayment(eventRegistration) ? 'danger' : 'success';
    };

    vm.orderByMe = function(x) {
      vm.myOrderBy = x;
    };
  }
})();