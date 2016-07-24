(function() {
  'use strict';

  // Persontypes controller
  angular
    .module('persontypes')
    .controller('PersontypesController', PersontypesController);

  PersontypesController.$inject = ['$scope', '$state', 'Authentication', 'persontypeResolve'];

  function PersontypesController($scope, $state, Authentication, persontype) {
    var vm = this;

    vm.authentication = Authentication;
    vm.persontype = persontype;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Persontype
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.persontype.$remove($state.go('persontypes.list'));
      }
    }

    // Save Persontype
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.persontypeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.persontype._id) {
        vm.persontype.$update(successCallback, errorCallback);
      } else {
        vm.persontype.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('persontypes.view', {
          persontypeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        if (vm.error === 'Name already exists') {
          vm.error = 'Ya existe un Tipo de persona con este nombre';
        }
      }
    }
  }
})();