(function() {
  'use strict';

  // Eventregistrations controller
  angular
    .module('eventregistrations')
    .controller('EventregistrationsController', EventregistrationsController);

  EventregistrationsController.$inject = ['$scope', '$state', '$stateParams', 'Authentication',
    'eventregistrationResolve', 'CurrentEventsService', 'EventpeoplegroupsService', 'personResolve',
    'PeopleService', 'EventregistrationsByEventService'
  ];

  function EventregistrationsController($scope, $state, $stateParams, Authentication, eventregistration,
    CurrentEventsService, EventpeoplegroupsService, person, PeopleService, EventregistrationsByEventService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.eventregistration = eventregistration;
    vm.error = null;
    vm.form = {};
    vm.events = CurrentEventsService.query();
    vm.eventPeopleGroups = EventpeoplegroupsService.query();
    vm.remove = remove;
    vm.save = save;
    vm.editMode = vm.eventregistration._id ? true : false;
    vm.setEvent = setEvent;
    vm.isNewMemberRegistration = isNewMemberRegistration;
    loadDates();

    if (!vm.isNewMemberRegistration()) {
      vm.person = undefined;
    } else {
      vm.person = person;
    }

    function isNewMemberRegistration() {
      if ($stateParams.newMember === 'true') {
        return true;
      } else {
        return false;
      }
    }

    if (vm.eventregistration._id) {
      vm.person = eventregistration.person;
      loadDates();
      PeopleService.get({
        personId: vm.eventregistration.person._id
      }, function(data) {
        vm.person = data;
        loadDates();
      });
    }

    function loadDates() {
      if (vm.person && vm.person.birthDate) {
        vm.person.birthDate = new Date(vm.person.birthDate);
      }
      if (vm.eventregistration && vm.eventregistration.registrationDate) {
        vm.eventregistration.registrationDate = new Date(vm.eventregistration.registrationDate);
      } else {
        vm.eventregistration.registrationDate = new Date();
      }
    }

    //set registration event
    function setEvent(event) {
      vm.eventregistration.event = event;
      vm.eventregistration.balanceAmount = event.price;

      if (!vm.isNewMemberRegistration()) {
        var people = PeopleService.query();
        vm.eventRegistrations = EventregistrationsByEventService.query({
          'eventId': event._id
        }, function(data) {
          filterPeopleListBySelectedEvent(people, data);
        });
      }
    }

    function filterPeopleListBySelectedEvent(people, eventPeople) {
      var registeredPeopleInSelectedEvent = _.map(eventPeople, function(item) {
        return item.person;
      });
      vm.people = _.differenceBy(people, registeredPeopleInSelectedEvent, '_id');
    }

    // Remove existing Eventregistration
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.eventregistration.$remove($state.go('eventregistrations.list'));
      }
    }

    // Save Person
    function savePerson() {
      if (vm.person._id) {
        vm.person.$update(successPersonCallback, errorPersonCallback);
      } else {
        vm.person.$save(successPersonCallback, errorPersonCallback);
      }

      function successPersonCallback(res) {
        vm.eventregistration.person = res;
        saveEventRegistration();
      }

      function errorPersonCallback(res) {
        vm.error = res.data.message;
      }
    }

    // Save EventRegistration
    function saveEventRegistration() {
      if (vm.eventregistration._id) {
        vm.eventregistration.$update(successCallback, errorCallback);
      } else {
        vm.eventregistration.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('eventregistrations.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    // Save Eventregistration
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.eventregistrationForm');
        return false;
      }
      savePerson();
    }
  }
})();