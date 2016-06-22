(function () {
  'use strict';

  // People controller
  angular
    .module('people')
    .controller('PeopleController', PeopleController);

  PeopleController.$inject = ['$scope', '$state', 'Authentication', 'personResolve'];

  function PeopleController ($scope, $state, Authentication, person) {
    var vm = this;

    vm.authentication = Authentication;
    vm.person = person;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Person
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.person.$remove($state.go('people.list'));
      }
    }

    // Save Person
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.personForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.person._id) {
        vm.person.$update(successCallback, errorCallback);
      } else {
        vm.person.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('people.view', {
          personId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
