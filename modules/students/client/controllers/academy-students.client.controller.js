(function() {
  'use strict';

  // Students controller
  angular
    .module('students')
    .controller('AcademyStudentsController', AcademyStudentsController);

  AcademyStudentsController.$inject = ['$scope', '$state', 'Authentication', 'studentResolve',
    'CurrentServiceAcademyClassesService', 'serviceacademyclassResolve', 'PeopleService'
  ];

  function AcademyStudentsController($scope, $state, Authentication, student,
    CurrentServiceAcademyClassesService, serviceacademyclass, PeopleService) {
    var vm = this;
    vm.authentication = Authentication;
    vm.student = student;
    vm.save = save;
    vm.people = PeopleService.query();

    vm.serviceAcademyClasses = CurrentServiceAcademyClassesService.query();
    vm.setServiceAcademyClass = setServiceAcademyClass;
    //set setServiceAcademyClass
    function setServiceAcademyClass(serviceAcademyClass) {
      vm.serviceAcademyClass = serviceAcademyClass;
    }
    vm.serviceAcademyClass = serviceacademyclass;

    // Save Student
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.studentForm');
        return false;
      }

      if (vm.student._id) {
        vm.student.$update(successCallback, errorCallback);
      } else {
        vm.student.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('students.view', {
          studentId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

  }
})();