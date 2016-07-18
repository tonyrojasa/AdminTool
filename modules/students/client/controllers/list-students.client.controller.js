(function() {
  'use strict';

  angular
    .module('students')
    .controller('StudentsListController', StudentsListController);

  StudentsListController.$inject = ['StudentsService', 'CurrentServiceAcademyClassesService'];

  function StudentsListController(StudentsService, CurrentServiceAcademyClassesService) {
    var vm = this;
    vm.serviceAcademyClasses = CurrentServiceAcademyClassesService.query();
    vm.setServiceAcademyClass = setServiceAcademyClass;
    //set registration event
    function setServiceAcademyClass(serviceAcademyClass) {
      vm.serviceAcademyClass = serviceAcademyClass;
    }

    vm.students = StudentsService.query();
  }
})();