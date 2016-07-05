(function () {
  'use strict';

  // Eventpeoplegroups controller
  angular
    .module('eventpeoplegroups')
    .controller('EventpeoplegroupsController', EventpeoplegroupsController);

  EventpeoplegroupsController.$inject = ['$scope', '$state', 'Authentication', 'eventpeoplegroupResolve'];

  function EventpeoplegroupsController ($scope, $state, Authentication, eventpeoplegroup) {
    var vm = this;

    vm.authentication = Authentication;
    vm.eventpeoplegroup = eventpeoplegroup;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Eventpeoplegroup
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.eventpeoplegroup.$remove($state.go('eventpeoplegroups.list'));
      }
    }

    // Save Eventpeoplegroup
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.eventpeoplegroupForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.eventpeoplegroup._id) {
        vm.eventpeoplegroup.$update(successCallback, errorCallback);
      } else {
        vm.eventpeoplegroup.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('eventpeoplegroups.view', {
          eventpeoplegroupId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
