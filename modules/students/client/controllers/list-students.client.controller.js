(function() {
  'use strict';

  angular
    .module('students')
    .controller('StudentsListController', StudentsListController);

  StudentsListController.$inject = ['$rootScope', 'StudentsService', 'ServiceacademyclassesService', 'serviceacademyclassResolve'];

  function StudentsListController($rootScope, StudentsService, ServiceacademyclassesService, serviceacademyclass) {
    var vm = this;
    vm.serviceAcademyClasses = ServiceacademyclassesService.query();
    vm.setServiceAcademyClass = setServiceAcademyClass;
    //set setServiceAcademyClass
    function setServiceAcademyClass(serviceAcademyClass) {
      vm.serviceAcademyClass = serviceAcademyClass;
    }

    $rootScope.showLoadingSpinner = true;
    vm.students = StudentsService.query(function() {
      $rootScope.showLoadingSpinner = false;
    }, function() {
      $rootScope.showLoadingSpinner = false;
    });
    vm.serviceAcademyClass = serviceacademyclass;

    vm.getStatusClass = getStatusClass;

    function getStatusClass(student) {
      var studentScore = student.score;
      if (studentScore === null) {
        return 'info';
      }

      if (studentScore >= 80) {
        return 'success';
      } else if (studentScore >= 70) {
        return 'warning';
      } else if (studentScore < 70 && studentScore >= 0) {
        return 'danger';
      } else {
        return 'info';
      }
    }
  }
})();