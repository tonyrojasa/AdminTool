(function() {
  'use strict';

  // People controller
  angular
    .module('people')
    .controller('PeopleController', PeopleController);

  PeopleController.$inject = ['_', '$rootScope', '$scope', '$anchorScroll', '$state', 'Authentication', 'personResolve'];

  function PeopleController(_, $rootScope, $scope, $anchorScroll, $state, Authentication, person) {
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


    vm.RequiredFields = [
      'organization',
      'sex',
      'firstName',
      'lastName',
      'secondLastName'
    ];

    // Remove existing Person
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.person.$remove($state.go('people.list'));
      }
    }

    // Save Person
    function save(isValid) {
      $rootScope.showLoadingSpinner = true;
      if (!isValid) {
        $rootScope.showLoadingSpinner = false;
        $scope.$broadcast('show-errors-check-validity', 'vm.form.personForm');
        vm.error = 'Corregir los errores del formulario';
        $anchorScroll(document.body.scrollTop);
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
      $rootScope.showLoadingSpinner = false;
      $state.go('people.view', {
        personId: res._id
      });
    }

    function errorCallback(res) {
      $rootScope.showLoadingSpinner = false;
      vm.error = res.data.message;
      if (vm.error === 'Email already exists') {
        vm.error = 'El e-mail pertenece a otra persona';
      }
      if (vm.error === 'MobilePhone already exists') {
        vm.error = 'El número de celular pertenece a otra persona';
      }
    }
  }
})();