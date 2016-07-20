(function () {
  'use strict';

  // Organizations controller
  angular
    .module('organizations')
    .controller('OrganizationsController', OrganizationsController);

  OrganizationsController.$inject = ['$scope', '$state', 'Authentication', 'organizationResolve'];

  function OrganizationsController ($scope, $state, Authentication, organization) {
    var vm = this;

    vm.authentication = Authentication;
    vm.organization = organization;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Organization
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.organization.$remove($state.go('organizations.list'));
      }
    }

    // Save Organization
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.organizationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.organization._id) {
        vm.organization.$update(successCallback, errorCallback);
      } else {
        vm.organization.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('organizations.view', {
          organizationId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
