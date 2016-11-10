(function() {
  'use strict';

  angular
    .module('events')
    .controller('EventsListController', EventsListController);

  EventsListController.$inject = ['EventsService'];

  function EventsListController(EventsService) {
    var vm = this;
    vm.events = EventsService.query();


    vm.getStatusClass = function(event) {
      if (event.ended) {
        return 'danger';
      } else if (!event.ended && !event.openEnrollment) {
        return 'warning';
      } else {
        return 'success';
      }
    };
  }
})();