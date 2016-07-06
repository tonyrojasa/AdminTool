(function () {
  'use strict';

  // Eventregistrations controller
  angular
    .module('eventregistrations')
    .controller('EventregistrationsController', EventregistrationsController);

  EventregistrationsController.$inject = ['$scope', '$state', 'Authentication', 
  'eventregistrationResolve', 'EventsService', 'EventpeoplegroupsService', 'personResolve'];

  function EventregistrationsController ($scope, $state, Authentication, eventregistration, 
    EventsService, EventpeoplegroupsService, person) {
    var vm = this;

    vm.authentication = Authentication;
    vm.eventregistration = eventregistration;
    vm.person = person;
    vm.error = null;
    vm.form = {};
    vm.events = EventsService.query();
    vm.eventPeopleGroups = EventpeoplegroupsService.query();
    vm.remove = remove;
    vm.save = save;
    vm.setEvent = setEvent;
    vm.setEventPeopleGroup = setEventPeopleGroup;

    if(vm.person._id){    
      EventsService.query({ id: vm.eventregistration.event },function(data){
        vm.selectedEventName = data[0].name;
      });
      EventpeoplegroupsService.query({ id: vm.eventregistration.eventPeopleGroup },function(data){
        vm.selectedEventPeopleGroupName = data[0].name;
      });
    }


    //set registration eventPeopleGroup
    function setEventPeopleGroup(eventPeopleGroup) {
      vm.eventregistration.eventPeopleGroup = eventPeopleGroup;
      vm.selectedEventPeopleGroupName = eventPeopleGroup.name;
    }

    //set registration event
    function setEvent(event) {
      vm.eventregistration.event = event;
      vm.selectedEventName = event.name;
      vm.eventregistration.balanceAmount = event.price;
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
        debugger;
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
        $state.go('eventregistrations.view', {
          eventregistrationId: res._id
        });
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
