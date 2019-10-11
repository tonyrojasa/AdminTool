(function () {
  'use strict';

  angular
    .module('users')
    .controller('ChangePasswordController', ChangePasswordController);

  ChangePasswordController.$inject = ['$scope', '$http', 'Authentication', 'UsersService', 'PasswordValidator', 'Notification', 'userResolve', '$state'];

  function ChangePasswordController($scope, $http, Authentication, UsersService, PasswordValidator, Notification, user, $state) {
    var vm = this;

    vm.user = user ? user : Authentication.user;
    vm.changeUserPassword = changeUserPassword;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;

    // Change user password
    function changeUserPassword(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.passwordForm');

        return false;
      }

      if (user) {
        vm.passwordDetails.user = vm.user;
      }

      UsersService.changePassword(vm.passwordDetails)
        .then(onChangePasswordSuccess)
        .catch(onChangePasswordError);
    }

    function onChangePasswordSuccess(response) {
      if (user) {
        $state.go('admin.user', {
          userId: user._id
        });
      }
      // If successful show success message and clear form
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Contraseña cambiada correctamente al usuario: ' + vm.user.username });
      vm.passwordDetails = null;
    }

    function onChangePasswordError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Error en el cambio de contraseñ!' });
    }
  }
}());
