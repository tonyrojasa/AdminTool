(function () {
  'use strict';

  // Serviceacademyclasses controller
  angular
    .module('serviceacademyclasses')
    .controller('ServiceacademyclassesController', ServiceacademyclassesController);

  ServiceacademyclassesController.$inject = ['$scope', '$state', 'Authentication', 'serviceacademyclassResolve'];

  function ServiceacademyclassesController ($scope, $state, Authentication, serviceacademyclass) {
    var vm = this;

    vm.authentication = Authentication;
    vm.serviceacademyclass = serviceacademyclass;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Serviceacademyclass
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.serviceacademyclass.$remove($state.go('serviceacademyclasses.list'));
      }
    }

    // Save Serviceacademyclass
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.serviceacademyclassForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.serviceacademyclass._id) {
        vm.serviceacademyclass.$update(successCallback, errorCallback);
      } else {
        vm.serviceacademyclass.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('serviceacademyclasses.view', {
          serviceacademyclassId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
