(function() {
  'use strict';

  // Eventgroups controller
  angular
    .module('eventgroups')
    .controller('EventgroupsController', EventgroupsController);

  EventgroupsController.$inject = ['$scope', '$state', 'Authentication', 'eventgroupResolve', 'EventregistrationsByEventService',
    'EventsService', 'EventpeoplegroupsService'
  ];

  function EventgroupsController($scope, $state, Authentication, eventgroup, EventregistrationsByEventService, EventsService,
    EventpeoplegroupsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.eventgroup = eventgroup;
    vm.error = null;
    vm.form = {};
    vm.events = EventsService.query();
    vm.eventPeopleGroups = EventpeoplegroupsService.query();
    vm.remove = remove;
    vm.save = save;
    vm.setEvent = setEvent;

    //set registration event
    function setEvent(event) {
      vm.unassignedRegistrations = null;
      EventregistrationsByEventService.query({
        'eventId': event._id
      }, function(data) {
        vm.unassignedRegistrations = data;
        //filterPeopleListBySelectedEvent(vm.people, data);
      });
    }

    // Remove existing Eventgroup
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.eventgroup.$remove($state.go('eventgroups.list'));
      }
    }

    // Save Eventgroup
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.eventgroupForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.eventgroup._id) {
        vm.eventgroup.$update(successCallback, errorCallback);
      } else {
        vm.eventgroup.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('eventgroups.view', {
          eventgroupId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();