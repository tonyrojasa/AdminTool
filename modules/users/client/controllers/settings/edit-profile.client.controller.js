(function() {
  'use strict';

  angular
    .module('users')
    .controller('EditProfileController', EditProfileController);

  EditProfileController.$inject = ['$scope', '$http', '$location', 'UsersService', 'Authentication'];

  function EditProfileController($scope, $http, $location, UsersService, Authentication) {
    var vm = this;

    vm.user = Authentication.user;
    vm.updateUserProfile = updateUserProfile;

    vm.setUserRole = function(role) {
      vm.user.roles = [role];
    };
    vm.getUserRoleName = function(role) {
      switch (role) {
        case 'admin':
          return 'Administrador';
        case 'user':
          return 'Usuario';
      }
    };

    // Update a user profile
    function updateUserProfile(isValid) {
      vm.success = vm.error = null;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      var user = new UsersService(vm.user);

      user.$update(function(response) {
        $scope.$broadcast('show-errors-reset', 'vm.userForm');

        vm.success = true;
        Authentication.user = response;
      }, function(response) {
        vm.error = response.data.message;
      });
    }
  }
}());