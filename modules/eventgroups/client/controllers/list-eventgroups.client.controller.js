(function () {
  'use strict';

  angular
    .module('eventgroups')
    .controller('EventgroupsListController', EventgroupsListController);

  EventgroupsListController.$inject = ['EventgroupsService'];

  function EventgroupsListController(EventgroupsService) {
    var vm = this;

    vm.eventgroups = EventgroupsService.query();
  }
})();
