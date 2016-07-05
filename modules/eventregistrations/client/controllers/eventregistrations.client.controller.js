(function () {
  'use strict';

  // Eventregistrations controller
  angular
    .module('eventregistrations')
    .controller('EventregistrationsController', EventregistrationsController);

  EventregistrationsController.$inject = ['$scope', '$state', 'Authentication', 'eventregistrationResolve', 'EventsService'];

  function EventregistrationsController ($scope, $state, Authentication, eventregistration, EventsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.eventregistration = eventregistration;
    vm.error = null;
    vm.form = {};
    vm.events = EventsService.query();
    vm.remove = remove;
    vm.save = save;
    vm.setEvent = setEvent;

    //set registration event
    function setEvent(event) {
      vm.eventregistration.event = event;
    }

    // Remove existing Eventregistration
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.eventregistration.$remove($state.go('eventregistrations.list'));
      }
    }

    // Save Eventregistration
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.eventregistrationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.eventregistration._id) {
        vm.eventregistration.$update(successCallback, errorCallback);
      } else {
        vm.eventregistration.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('eventregistrations.view', {
          eventregistrationId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
