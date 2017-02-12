(function() {
  'use strict';

  angular
    .module('eventgroups')
    .controller('EventgroupsListController', EventgroupsListController);

  EventgroupsListController.$inject = ['EventgroupsService', 'CurrentEventsService', 'EventpeoplegroupsService'];

  function EventgroupsListController(EventgroupsService, CurrentEventsService, EventpeoplegroupsService) {
    var vm = this;
    vm.showMembers = false;
    vm.showContactInfo = false;

    vm.events = CurrentEventsService.query();
    vm.eventPeopleGroups = EventpeoplegroupsService.query();

    vm.setEvent = function(event) {
      EventgroupsService.query({
        'event': event._id
      }, function(data) {
        vm.eventgroups = data;
      });
    };

    vm.orderByMe = function(x) {
      vm.myOrderBy = x;
    };
  }
})();