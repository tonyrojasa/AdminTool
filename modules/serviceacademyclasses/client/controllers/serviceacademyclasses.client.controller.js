(function() {
  'use strict';

  // Serviceacademyclasses controller
  angular
    .module('serviceacademyclasses')
    .controller('ServiceacademyclassesController', ServiceacademyclassesController);

  ServiceacademyclassesController.$inject = ['_', '$scope', '$state', 'Authentication', 'serviceacademyclassResolve',
    'OrganizationsService', 'PeopleService'
  ];

  function ServiceacademyclassesController(_, $scope, $state, Authentication, serviceacademyclass,
    OrganizationsService, PeopleService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.serviceacademyclass = serviceacademyclass;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.parseSchedule = parseSchedule;
    vm.isGtToday = isGtToday;

    vm.people = PeopleService.query();
    vm.organizations = OrganizationsService.query(function(organizations){
      vm.serviceacademyclass.organization = organizations.length === 1 ? organizations[0] : vm.serviceacademyclass.organization;
    });
    vm.setOrganization = function(organization) {
      vm.serviceacademyclass.organization = organization;
    };

    vm.levels = [{
      name: 'Nivel 1',
      value: 1
    }, {
      name: 'Nivel 2',
      value: 2
    }, {
      name: 'Nivel 3',
      value: 3
    }];

    vm.schedules = [{
      name: 'Lunes',
      value: 'L',
      selected: false
    }, {
      name: 'Martes',
      value: 'K',
      selected: false
    }, {
      name: 'Miercoles',
      value: 'M',
      selected: false
    }, {
      name: 'Jueves',
      value: 'J',
      selected: false
    }, {
      name: 'Viernes',
      value: 'V',
      selected: false
    }, {
      name: 'Sábado',
      value: 'S',
      selected: false
    }, {
      name: 'Domingo',
      value: 'D',
      selected: false
    }];

    if (!vm.serviceacademyclass.schedule) {
      vm.serviceacademyclass.schedule = [];
    } else {
      vm.selectedSchedule = vm.serviceacademyclass.schedule;
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

    if (vm.serviceacademyclass.schedule) {
      _.forEach(vm.serviceacademyclass.schedule, function(value, key) {
        _.find(vm.schedules, function(o) {
          if (o.value === value) {
            o.selected = true;
            return true;
          }
        });
      });
    }

    function parseSchedule(sheduleArray) {
      _.forEach(sheduleArray,
        function(value, key) {
          switch (value) {
            case "L":
              sheduleArray[key] = "Lunes";
              break;
            case "K":
              sheduleArray[key] = "Martes";
              break;
            case "M":
              sheduleArray[key] = "Miercoles";
              break;
            case "J":
              sheduleArray[key] = "Jueves";
              break;
            case "V":
              sheduleArray[key] = "Viernes";
              break;
            case "S":
              sheduleArray[key] = "Sábado";
              break;
            case "D":
              sheduleArray[key] = "Domingo";
              break;
          }
        });
      var scheduleValue = sheduleArray.join(', ');
      return scheduleValue;
    }

    // toggle selection for a given schedule by name
    vm.toggleScheduleSelection = function toggleScheduleSelection(scheduleValue) {
      var idx = vm.serviceacademyclass.schedule.indexOf(scheduleValue);
      // is currently selected
      if (idx > -1) {
        vm.serviceacademyclass.schedule.splice(idx, 1);
      } else { // is newly selected
        vm.serviceacademyclass.schedule.push(scheduleValue);
      }
      if (vm.serviceacademyclass.schedule.length > 0) {
        vm.selectedSchedule = vm.serviceacademyclass.schedule;
      } else {
        vm.selectedSchedule = null;
      }
    };

    // Check if date is  gt today
    function isGtToday(date) {
      var givenDate = new Date(date);
      var today = new Date();
      if (givenDate > today) {
        return true;
      } else {
        return false;
      }
    }

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