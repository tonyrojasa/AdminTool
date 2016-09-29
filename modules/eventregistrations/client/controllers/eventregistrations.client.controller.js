(function() {
  'use strict';

  // Eventregistrations controller
  angular
    .module('eventregistrations')
    .controller('EventregistrationsController', EventregistrationsController);

  EventregistrationsController.$inject = ['$scope', '$anchorScroll', '$state', '$stateParams', 'Authentication',
    'eventregistrationResolve', 'CurrentEventsService', 'EventpeoplegroupsService', 'personResolve',
    'PeopleService', 'EventregistrationsByEventService', '$rootScope'
  ];

  function EventregistrationsController($scope, $anchorScroll, $state, $stateParams, Authentication, eventregistration,
    CurrentEventsService, EventpeoplegroupsService, person, PeopleService, EventregistrationsByEventService, $rootScope) {
    var vm = this;

    vm.authentication = Authentication;
    vm.eventregistration = eventregistration;
    vm.error = null;
    vm.form = {};
    vm.events = CurrentEventsService.query();
    vm.eventPeopleGroups = EventpeoplegroupsService.query();
    vm.save = save;
    vm.editMode = vm.eventregistration._id ? true : false;
    vm.setEvent = setEvent;
    vm.isNewMemberRegistration = isNewMemberRegistration;
    vm.setEventPrice = setEventPrice;
    vm.shirtQuantities = [0, 1, 2, 3, 4, 5];
    vm.setShirtsQuantity = function(shirtsQuantity) {
      vm.eventregistration.shirtsQuantity = shirtsQuantity;
      vm.setEventPrice(vm.eventregistration.event);
    };
    vm.shirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    vm.setShirtSize = function(shirtSize) {
      vm.person.shirtSize = shirtSize;
    };
    loadDates();

    if (!vm.isNewMemberRegistration()) {
      vm.person = undefined;
    } else {
      vm.person = person;
    }

    function setEventPrice(event) {
      if (!vm.eventregistration._id) {
        if (vm.eventregistration.isEventServer) {
          vm.eventregistration.balanceAmount = event.serverPrice;
          if (event.shirtPrice && vm.eventregistration.shirtsQuantity) {
            vm.eventregistration.balanceAmount += (event.shirtPrice * vm.eventregistration.shirtsQuantity);
          }
        } else {
          vm.eventregistration.balanceAmount = event.price;
        }
      }
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
      vm.eventregistration.shirtsQuantity = 1;
      vm.setEventPrice(event);

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
        $rootScope.showSpinner = false;
        vm.error = res.data.message;
        if (vm.error === 'Email already exists') {
          vm.error = 'El Email pertenece a otra persona';
        }
        if (vm.error === 'MobilePhone already exists') {
          vm.error = 'El número de celular pertenece a otra persona';
        }

        $anchorScroll(document.body.scrollTop);
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
        $rootScope.showLoadingSpinner = false;
        $state.go('eventregistrations.list');
      }

      function errorCallback(res) {
        $rootScope.showLoadingSpinner = false;
        vm.error = res.data.message;
        $anchorScroll(document.body.scrollTop);
      }
    }

    // Save Eventregistration
    function save(isValid) {
      $rootScope.showLoadingSpinner = true;
      if (!isValid) {
        $rootScope.showLoadingSpinner = false;
        $scope.$broadcast('show-errors-check-validity', 'vm.form.eventregistrationForm');
        vm.error = 'Corregir los errores del formulario';
        $anchorScroll(document.body.scrollTop);
        return false;
      }
      savePerson();
    }
  }
})();