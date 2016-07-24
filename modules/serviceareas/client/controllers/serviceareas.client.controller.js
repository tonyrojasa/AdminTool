(function() {
  'use strict';

  // Serviceareas controller
  angular
    .module('serviceareas')
    .controller('ServiceareasController', ServiceareasController);

  ServiceareasController.$inject = ['$scope', '$state', 'Authentication', 'serviceareaResolve'];

  function ServiceareasController($scope, $state, Authentication, servicearea) {
    var vm = this;

    vm.authentication = Authentication;
    vm.servicearea = servicearea;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Servicearea
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.servicearea.$remove($state.go('serviceareas.list'));
      }
    }

    // Save Servicearea
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.serviceareaForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.servicearea._id) {
        vm.servicearea.$update(successCallback, errorCallback);
      } else {
        vm.servicearea.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('serviceareas.view', {
          serviceareaId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        if (vm.error === 'Name already exists') {
          vm.error = 'Ya existe un Área de servicio con este nombre';
        }
      }
    }
  }
})();