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
    vm.remove = remove;

    // Remove existing Person
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.person.$remove($state.go('people.list'));
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
