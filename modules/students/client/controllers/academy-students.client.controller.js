(function() {
  'use strict';

  // Students controller
  angular
    .module('students')
    .controller('AcademyStudentsController', AcademyStudentsController);

  AcademyStudentsController.$inject = ['$scope', '$state', '$stateParams', 'Authentication', 'AcademyStudentsService'];

  function AcademyStudentsController($scope, $state, $stateParams, Authentication, AcademyStudentsService) {
    var vm = this;
    vm.authentication = Authentication;

    debugger;
    AcademyStudentsService.get({
      serviceacademyclassId: $stateParams.serviceacademyclassId
    }, function(error, data) {
      debugger;
      vm.students = data;
    }, function(error, data) {
      debugger;
    });

  }
})();