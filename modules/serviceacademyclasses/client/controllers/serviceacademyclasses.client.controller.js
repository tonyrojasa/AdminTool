(function() {
  'use strict';

  // Serviceacademyclasses controller
  angular
    .module('serviceacademyclasses')
    .controller('ServiceacademyclassesController', ServiceacademyclassesController);

  ServiceacademyclassesController.$inject = ['$scope', '$state', 'Authentication', 'serviceacademyclassResolve', 'OrganizationsService'];

  function ServiceacademyclassesController($scope, $state, Authentication, serviceacademyclass, OrganizationsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.serviceacademyclass = serviceacademyclass;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.organizations = OrganizationsService.query();
    vm.setOrganization = function(organization) {
      vm.serviceacademyclass.organization = organization;
    };

    if (!vm.serviceacademyclass.schedule) {
      vm.serviceacademyclass.schedule = [];
    }

    if (vm.serviceacademyclass.startDate) {
      vm.serviceacademyclass.startDate = new Date(vm.serviceacademyclass.startDate);
    } else {
      vm.serviceacademyclass.startDate = new Date();
    }
    if (vm.serviceacademyclass.endDate) {
      vm.serviceacademyclass.endDate = new Date(vm.serviceacademyclass.endDate);
    } else {
      vm.serviceacademyclass.endDate = new Date();
    }


    vm.levels = [{
      name: 'Nivel 1',
      value: 1
    }, {
      name: 'Nivel 2',
      value: 2
    }, {
      name: 'Nivel 3',
      value: 2
    }];

    vm.schedules = [{
      name: 'Lunes',
      value: 'L'
    }, {
      name: 'Martes',
      value: 'K'
    }, {
      name: 'Miercoles',
      value: 'M'
    }, {
      name: 'Jueves',
      value: 'J'
    }, {
      name: 'Viernes',
      value: 'V'
    }, {
      name: 'Sábado',
      value: 'S'
    }, {
      name: 'Domingo',
      value: 'D'
    }];

    // toggle selection for a given schedule by name
    vm.toggleScheduleSelection = function toggleScheduleSelection(scheduleValue) {
      var idx = vm.serviceacademyclass.schedule.indexOf(scheduleValue);
      // is currently selected
      if (idx > -1) {
        vm.serviceacademyclass.schedule.splice(idx, 1);
      } else { // is newly selected
        vm.serviceacademyclass.schedule.push(scheduleValue);
      }
    };

    // Remove existing Serviceacademyclass
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.serviceacademyclass.$remove($state.go('serviceacademyclasses.list'));
      }
    }

    // Save Serviceacademyclass
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.serviceacademyclassForm');
        return false;
      }

      if (vm.serviceacademyclass._id) {
        vm.serviceacademyclass.$update(successCallback, errorCallback);
      } else {
        vm.serviceacademyclass.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('serviceacademyclasses.view', {
          serviceacademyclassId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();