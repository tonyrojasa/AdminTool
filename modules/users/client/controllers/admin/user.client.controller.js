(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserController', UserController);

  UserController.$inject = ['$scope', '$state', '$window', 'Authentication', 'userResolve', 'Notification'];

  function UserController($scope, $state, $window, Authentication, user, Notification) {
    var vm = this;

    vm.authentication = Authentication;
    vm.user = user;
    vm.remove = remove;
    vm.update = update;
    vm.isContextUserSelf = isContextUserSelf;

    vm.roles = [{
      name: 'Administrador',
      value: 'admin',
      selected: false
    }, {
      name: 'Estándar',
      value: 'user',
      selected: false
    }, {
      name: 'Invitado',
      value: 'guest',
      selected: false
    }, {
      name: 'Inscriptor',
      value: 'inscriptor',
      selected: false
    }, {
      name: 'Profesor',
      value: 'teacher',
      selected: false
    }, {
      name: 'Estudiante',
      value: 'student',
      selected: false
    }, {
      name: 'Contador',
      value: 'accountant',
      selected: false
    }];

    if (!vm.user.roles) {
      vm.user.roles = [];
    } else {
      vm.selectedRole = vm.user.roles;
    }

    debugger;
    if (vm.authentication.isBoardDirectorUser()) {
      vm.roles.push({
        name: 'Directivo (junta directiva)',
        value: 'boardDirector',
        selected: false
      });
    }

    if (vm.authentication.isBoardDirectorUser() || vm.authentication.isBoardReviewerUser()) {
      vm.roles.push({
        name: 'Revisor (junta directiva)',
        value: 'boardReviewer',
        selected: false
      });
    }

    //check roles when edit mode
    if (vm.user.roles) {
      _.forEach(vm.user.roles, function (value, key) {
        _.find(vm.roles, function (o) {
          if (o.value === value) {
            o.selected = true;
            return true;
          }
        });
      });
    }


    vm.parseRoles = function (roleArray) {
      _.forEach(roleArray,
        function (value, key) {
          switch (value) {
            case "admin":
              roleArray[key] = "Administrador";
              break;
            case "user":
              roleArray[key] = "Estándar";
              break;
            case "guest":
              roleArray[key] = "Invitado";
              break;
            case "inscriptor":
              roleArray[key] = "Inscriptor de eventos";
              break;
            case "teacher":
              roleArray[key] = "Profesor";
              break;
            case "student":
              roleArray[key] = "Estudiante";
              break;
            case "accountant":
              roleArray[key] = "Contador";
              break;
            case "boardDirector":
              roleArray[key] = "Directivo (junta directiva)";
              break;
            case "boardReviewer":
              roleArray[key] = "Revisor (junta directiva)";
              break;
          }
        });
      var roleValue = roleArray.join(', ');
      return roleValue;
    };

    // toggle selection for a given role by name
    vm.toggleRoleSelection = function toggleRoleSelection(roleValue) {
      var idx = vm.user.roles.indexOf(roleValue);
      // is currently selected
      if (idx > -1) {
        vm.user.roles.splice(idx, 1);
      } else { // is newly selected
        vm.user.roles.push(roleValue);
      }
      if (vm.user.roles.length > 0) {
        vm.selectedRole = vm.user.roles;
      } else {
        vm.selectedRole = null;
      }
    };

    function remove(user) {
      if ($window.confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          vm.users.splice(vm.users.indexOf(user), 1);
          Notification.success('User deleted successfully!');
        } else {
          vm.user.$remove(function () {
            $state.go('admin.users');
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User deleted successfully!' });
          });
        }
      }
    }

    function update(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      var user = vm.user;

      user.$update(function (user) {
        $window.user = user;
        $state.go('admin.user', {
          userId: user._id
        });
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User saved successfully!' });
      }, function (errorResponse) {
        Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User update error!' });
      });
    }

    function isContextUserSelf() {
      return vm.user.username === vm.authentication.user.username;
    }
  }
}());