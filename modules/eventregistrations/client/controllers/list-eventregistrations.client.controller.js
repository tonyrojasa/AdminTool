(function () {
  'use strict';

  angular
    .module('eventregistrations')
    .controller('EventregistrationsListController', EventregistrationsListController);

  EventregistrationsListController.$inject = ['EventregistrationsService'];

  function EventregistrationsListController(EventregistrationsService) {
    var vm = this;

    vm.eventregistrations = EventregistrationsService.query();
  }
})();
