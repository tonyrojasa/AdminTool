(function() {
  'use strict';

  // Assistances controller
  angular
    .module('assistances')
    .controller('AssistancesController', AssistancesController);

  AssistancesController.$inject = ['$scope', '$state', 'Authentication', 'assistanceResolve',
    'StudentsByServiceAcademyClass', 'CurrentServiceAcademyClassesService', 'serviceacademyclassResolve'
  ];

  function AssistancesController($scope, $state, Authentication, assistance,
    StudentsByServiceAcademyClass, CurrentServiceAcademyClassesService, serviceacademyclass) {
    var vm = this;

    vm.authentication = Authentication;
    vm.assistance = assistance;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.getStatusClass = getStatusClass;

    function getStatusClass(student) {
      var studentStatus = student.status;

      switch (studentStatus) {
        case 'early':
          return 'success';
        case 'late':
          return 'warning';
        case 'absent':
          return 'danger';
        default:
          return 'info';
      }
    }

    vm.getStatusName = getStatusName;

    function getStatusName(status) {
      switch (status) {
        case 'early':
          return 'Presente';
        case 'late':
          return 'Tarde';
        case 'absent':
          return 'Ausente';
        default:
          return 'No Ingresado';
      }
    }

    if (serviceacademyclass) {
      loadServiceAcademyClassStudents(serviceacademyclass._id);
    } else if (vm.assistance.serviceAcademyClass) {
      loadServiceAcademyClassStudents(vm.assistance.serviceAcademyClass._id);
    }

    loadDates();

    vm.serviceAcademyClasses = CurrentServiceAcademyClassesService.query();
    vm.setServiceAcademyClass = setServiceAcademyClass;
    //set setServiceAcademyClass
    function setServiceAcademyClass(serviceAcademyClass) {
      vm.assistance.serviceAcademyClass = serviceAcademyClass;
      if (serviceAcademyClass._id) {
        loadServiceAcademyClassStudents(serviceAcademyClass._id);
      }
    }

    // $scope.$watch('vm.assistance.serviceAcademyClass', function(newSelected, oldSelected) {
    //   if (newSelected && oldSelected) {
    //     vm.assistance.assistants = null;
    //   } else if (newSelected) {
    //     loadServiceAcademyClassStudents(newSelected._id);
    //   }
    // })


    //load ServiceAcademyClass Students
    function loadServiceAcademyClassStudents(serviceAcademyClassId) {
      StudentsByServiceAcademyClass.query({
        'serviceacademyclassId': serviceAcademyClassId
      }, function(data) {
        if (data.length > 0) {
          createServiceAcademyClassStudents(vm.assistance.assistants, data);
        } else {
          vm.assistance.assistants = null;
        }
      });
    }

    function loadDates() {
      if (vm.assistance && vm.assistance.assistanceDate) {
        vm.assistance.assistanceDate = new Date(vm.assistance.assistanceDate);
      } else {
        vm.assistance.assistanceDate = new Date();
      }
    }

    function createServiceAcademyClassStudents(oldAssistants, ServiceAcademyClassStudents) {
      oldAssistants = _.map(oldAssistants, function(item) {
        return item.person;
      });
      ServiceAcademyClassStudents = _.map(ServiceAcademyClassStudents, function(item) {
        return item.person;
      });

      var pendingServiceAcademyClassStudents = _.differenceBy(ServiceAcademyClassStudents, oldAssistants, '_id');
      var removedServiceAcademyClassStudents = _.differenceBy(oldAssistants, ServiceAcademyClassStudents, '_id');

      vm.assistance.assistants = vm.assistance.assistants ? vm.assistance.assistants : [];

      _.forEach(pendingServiceAcademyClassStudents, function(person) {
        vm.assistance.assistants.push({
          person: person,
          status: 'absent'
        });
      });

      _.forEach(removedServiceAcademyClassStudents, function(person) {
        vm.assistance.assistants = _.remove(vm.assistance.assistants, function(existingAsistant) {
          return existingAsistant.person._id != person._id;
        });
      });
    }


    // Remove existing Assistance
    function remove() {
      if (confirm('Esta seguro que desea eliminar esta lista de asistencia?')) {
        vm.assistance.$remove($state.go('assistances.list'));
      }
    }

    // Save Assistance
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.assistanceForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.assistance._id) {
        vm.assistance.$update(successCallback, errorCallback);
      } else {
        vm.assistance.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('assistances.view', {
          assistanceId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();