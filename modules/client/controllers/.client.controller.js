(function () {
  'use strict';

  //  controller
  angular
    .module('')
    .controller('Controller', Controller);

  Controller.$inject = ['$scope', '$state', 'Authentication', 'Resolve'];

  function Controller ($scope, $state, Authentication, ) {
    var vm = this;

    vm.authentication = Authentication;
    vm. = ;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing 
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm..$remove($state.go('.list'));
      }
    }

    // Save 
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.Form');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.._id) {
        vm..$update(successCallback, errorCallback);
      } else {
        vm..$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('.view', {
          Id: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
