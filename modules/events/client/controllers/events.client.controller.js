(function() {
  'use strict';

  // Events controller
  angular
    .module('events')
    .controller('EventsController', EventsController);

  EventsController.$inject = ['$scope', '$state', 'Authentication', 'eventResolve', 'OrganizationsService'];

  function EventsController($scope, $state, Authentication, event, OrganizationsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.event = event;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.dateOptions = {
      showWeeks: false
    };

    vm.format = 'dd-MMM-yyyy';

    if (vm.event.startDate) {
      vm.event.startDate = new Date(vm.event.startDate);
    } else {
      vm.event.startDate = new Date();
    }
    if (vm.event.endDate) {
      vm.event.endDate = new Date(vm.event.endDate);
    } else {
      vm.event.endDate = new Date();
    }


    vm.organizations = OrganizationsService.query();
    vm.setOrganization = function(organization) {
      vm.event.organization = organization;
    };

    // Remove existing Event
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.event.$remove($state.go('events.list'));
      }
    }

    vm.quickRegistrationChanged = function() {
      vm.event.nonRegistration = false;
    };

    vm.nonRegistrationChanged = function() {
      vm.event.quickRegistration = false;
    };

    vm.getRegistrationType = function(event) {
      var result = 'Regular';
      if (event.quickRegistration) {
        result = 'Inscripción Rápida';
      } else if (event.nonRegistration) {
        result = 'No requiere inscripción';
      }
      return result;
    }

    // Save Event
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.eventForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.event._id) {
        vm.event.$update(successCallback, errorCallback);
      } else {
        vm.event.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('events.view', {
          eventId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();