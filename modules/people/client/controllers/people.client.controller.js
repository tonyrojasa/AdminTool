(function() {
  'use strict';

  // People controller
  angular
    .module('people')
    .controller('PeopleController', PeopleController);

  PeopleController.$inject = ['_', '$scope', '$state', 'Authentication', 'personResolve'];

  function PeopleController(_, $scope, $state, Authentication, person) {
    var vm = this;

    vm.authentication = Authentication;
    vm.person = person;
    vm.form = {};
    vm.error = null;
    vm.remove = remove;
    vm.save = save;

    vm.getServiceAreaNames = getServiceAreaNames;

    function getServiceAreaNames(serviceAreaArray) {
      if (serviceAreaArray && serviceAreaArray.length > 0) {
        var parsedServiceAreasArray = [];
        for (var index in serviceAreaArray) {
          if (serviceAreaArray[index].name) {
            parsedServiceAreasArray.push(serviceAreaArray[index].name);
          }
        }
        return parsedServiceAreasArray.join(', ');
      }
    }


    // Remove existing Person
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.person.$remove($state.go('people.list'));
      }
    }

    // Save Person
    function save(isValid) {
      debugger;
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
    }

    // Save Person callbacks
    function successCallback(res) {
      $state.go('people.view', {
        personId: res._id
      });
    }

    function errorCallback(res) {
      vm.error = res.data.message;
    }
  }
})();