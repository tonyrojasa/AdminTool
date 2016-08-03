(function() {
  'use strict';

  angular
    .module('eventregistrations')
    .controller('EventregistrationsListController', EventregistrationsListController);

  EventregistrationsListController.$inject = ['EventregistrationsService', 'EventsService', 'Authentication'];

  function EventregistrationsListController(EventregistrationsService, EventsService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.events = EventsService.query();
    vm.eventregistrations = EventregistrationsService.query();
    vm.setEvent = setEvent;

    //set registration event
    function setEvent(event) {
      vm.event = event;
    }
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
      return vm.hasPendingPayment(eventRegistration) ? 'warning' : 'success';
    };

  }
})();