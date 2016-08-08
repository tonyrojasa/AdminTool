(function() {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserListController', UserListController);

  UserListController.$inject = ['$scope', '$filter', 'AdminService'];

  function UserListController($scope, $filter, AdminService) {
    var vm = this;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    vm.parseRoles = function(roleArray) {
      _.forEach(roleArray,
        function(value, key) {
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
          }
        });
      var roleValue = roleArray.join(', ');
      return roleValue;
    };

    AdminService.query(function(data) {
      vm.users = data;
      vm.buildPager();
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.users, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }
  }
}());