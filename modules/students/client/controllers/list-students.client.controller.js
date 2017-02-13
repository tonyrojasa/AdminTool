(function() {
  'use strict';

  angular
    .module('students')
    .controller('StudentsListController', StudentsListController);

  StudentsListController.$inject = ['StudentsService', 'ServiceacademyclassesService', 'serviceacademyclassResolve'];

  function StudentsListController(StudentsService, ServiceacademyclassesService, serviceacademyclass) {
    var vm = this;
    vm.serviceAcademyClasses = ServiceacademyclassesService.query();
    vm.setServiceAcademyClass = setServiceAcademyClass;
    //set setServiceAcademyClass
    function setServiceAcademyClass(serviceAcademyClass) {
      vm.serviceAcademyClass = serviceAcademyClass;
    }

    vm.students = StudentsService.query();
    vm.serviceAcademyClass = serviceacademyclass;

    vm.getStatusClass = getStatusClass;

    function getStatusClass(student) {
      var studentScore = student.score;
      if (studentScore === null) {
        return 'info';
      }
      debugger;
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