(function () {
  'use strict';

  angular
    .module('eventpeoplegroups')
    .controller('EventpeoplegroupsListController', EventpeoplegroupsListController);

  EventpeoplegroupsListController.$inject = ['EventpeoplegroupsService'];

  function EventpeoplegroupsListController(EventpeoplegroupsService) {
    var vm = this;

    vm.eventpeoplegroups = EventpeoplegroupsService.query();
  }
})();
