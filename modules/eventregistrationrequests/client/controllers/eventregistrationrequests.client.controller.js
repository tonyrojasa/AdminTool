(function () {
  'use strict';

  // Eventregistrationrequests controller
  angular
    .module('eventregistrationrequests')
    .controller('EventregistrationrequestsController', EventregistrationrequestsController);

  EventregistrationrequestsController.$inject = ['$scope', '$anchorScroll', '$state', '$stateParams', 'Authentication',
    'eventregistrationrequestResolve', 'CurrentEventsService', 'EventpeoplegroupsService',
    'PeopleService', 'EventregistrationrequestsByEventService', '$rootScope', 'PersontypesService', 'Notification',
    'StudentsService', '$filter'
  ];

  function EventregistrationrequestsController($scope, $anchorScroll, $state, $stateParams, Authentication, eventregistrationrequest,
    CurrentEventsService, EventpeoplegroupsService, PeopleService, EventregistrationrequestsByEventService, $rootScope,
    PersontypesService, Notification, StudentsService, $filter) {
    var vm = this;

    vm.authentication = Authentication;
    vm.eventregistrationrequest = eventregistrationrequest;
    vm.error = null;
    vm.form = {};
    vm.events = CurrentEventsService.query();
    vm.eventPeopleGroups = EventpeoplegroupsService.query();
    vm.save = save;
    vm.editMode = vm.eventregistrationrequest._id ? true : false;
    vm.setEvent = setEvent;
    vm.clearEventSelection = clearEventSelection;
    vm.isSelectionDisabled = isSelectionDisabled;
    vm.setEventPrice = setEventPrice;
    vm.shirtQuantities = [0, 1, 2, 3, 4, 5];
    vm.setShirtsQuantity = function (shirtsQuantity) {
      vm.eventregistrationrequest.shirtsQuantity = shirtsQuantity;
      vm.setEventPrice(vm.eventregistrationrequest.event);
    };
    vm.quantities = _.range(1, 1001);
    vm.setQuantity = function (quantity) {
      vm.eventregistrationrequest.quantity = quantity;
      vm.setEventPrice(vm.eventregistrationrequest.event);
    };
    vm.oldShirtsQuantity = vm.eventregistrationrequest.shirtsQuantity;
    vm.oldQuantity = vm.eventregistrationrequest.quantity;
    vm.oldBalanceAmount = vm.eventregistrationrequest.balanceAmount;
    vm.shirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    vm.setShirtSize = function (shirtSize) {
      vm.eventregistrationrequest.person.shirtSize = shirtSize;
    };
    vm.personTypes = PersontypesService.query();
    vm.setPersonType = function (personType) {
      vm.eventregistrationrequest.personType = personType;
      if (vm.eventregistrationrequest.person && !vm.eventregistrationrequest.person.personType) {
        vm.eventregistrationrequest.person.personType = personType;
      }
    };
    vm.isQuickRegistration = isQuickRegistration;
    vm.regularRegistrationRequiredFields = [
      'personId',
      'sex',
      'firstName',
      'lastName',
      'secondLastName',
      'address',
      'personType',
      'age',
      'maritalStatus',
      'email',
      'mobilePhone',
      'shirtSize'
    ];
    vm.quickRegistrationRequiredFields = [
      'personId',
      'sex',
      'firstName',
      'lastName',
      'secondLastName',
      'mobilePhone'
    ];
    init();

    function init() {
      vm.eventregistrationrequest.quantity = vm.eventregistrationrequest.quantity ? vm.eventregistrationrequest.quantity : 1;
      loadDates();

      if (!vm.eventregistrationrequest.eventExternalServer) {
        vm.eventregistrationrequest.eventExternalServer = {
          isEventExternalServer: false,
          specialPrice: 0
        };
      }
    }

    function isQuickRegistration() {
      return vm.eventregistrationrequest.event && vm.eventregistrationrequest.event.quickRegistration;
    }

    function setEventPrice(event) {
      if (!vm.eventregistrationrequest._id) {//if new eventregistrationrequest
        if (vm.eventregistrationrequest.isEventServer) {// for event server registration 
          vm.eventregistrationrequest.balanceAmount = event.serverPrice;
          if (event.shirtPrice && vm.eventregistrationrequest.shirtsQuantity) {
            vm.eventregistrationrequest.balanceAmount += (event.shirtPrice * vm.eventregistrationrequest.shirtsQuantity);
          }
        } else if (vm.eventregistrationrequest.eventExternalServer.isEventExternalServer) { //for external server
          vm.eventregistrationrequest.balanceAmount = vm.eventregistrationrequest.eventExternalServer.specialPrice;
          if (event.shirtPrice && vm.eventregistrationrequest.shirtsQuantity) {
            vm.eventregistrationrequest.balanceAmount += (event.shirtPrice * vm.eventregistrationrequest.shirtsQuantity);
          }
        } else { //normal event registration price
          if (event.shirtPrice && vm.eventregistrationrequest.shirtsQuantity) {
            vm.eventregistrationrequest.balanceAmount = (event.price * vm.eventregistrationrequest.quantity) +
              (event.shirtPrice * vm.eventregistrationrequest.shirtsQuantity);
          } else {
            vm.eventregistrationrequest.balanceAmount = event.price * vm.eventregistrationrequest.quantity;
          }
        }
      } else {//if existing eventregistrationrequest
        //shirt price calculation
        var newShirtsQuantity = vm.eventregistrationrequest.shirtsQuantity - vm.oldShirtsQuantity;
        if (newShirtsQuantity === 0) {
          vm.eventregistrationrequest.balanceAmount = vm.oldBalanceAmount;
        } else {
          vm.eventregistrationrequest.balanceAmount = vm.oldBalanceAmount + (event.shirtPrice * newShirtsQuantity);
        }
        //event price calculation
        var newQuantity = vm.eventregistrationrequest.quantity - vm.oldQuantity;
        if (newQuantity === 0) {
          vm.eventregistrationrequest.balanceAmount = vm.oldBalanceAmount;
        } else {
          vm.eventregistrationrequest.balanceAmount = vm.oldBalanceAmount + (event.price * newQuantity);
        }
      }
    }

    if (vm.eventregistrationrequest._id) {
      loadDates();
    }

    function loadDates() {
      if (vm.eventregistrationrequest.person && vm.eventregistrationrequest.person.birthDate) {
        vm.eventregistrationrequest.person.birthDate = new Date(vm.eventregistrationrequest.person.birthDate);
      }
      if (vm.eventregistrationrequest && vm.eventregistrationrequest.registrationDate) {
        vm.eventregistrationrequest.registrationDate = new Date(vm.eventregistrationrequest.registrationDate);
      } else {
        vm.eventregistrationrequest.registrationDate = new Date();
      }
    }

    function isSelectionDisabled() {
      if (!vm.eventregistrationrequest._id || (vm.eventregistrationrequest._id && vm.authentication.isUserAdmin())) {
        return false;
      }
      return true;
    }

    function clearEventSelection() {
      vm.eventregistrationrequest.event = undefined;
      vm.eventregistrationrequest.person = undefined;
      vm.eventregistrationrequest.isEventServer = undefined;
      vm.eventregistrationrequest.eventExternalServer.isEventExternalServer = undefined;
      vm.eventregistrationrequest.balanceAmount = vm.eventregistrationrequest._id ? vm.eventregistrationrequest.balanceAmount : undefined;
    }

    vm.setPerson = function (personId) {
      vm.eventregistrationrequest.person = _.find(vm.filteredPeopleItems, function (o) {
        return o._id === personId;
      });
    }

    //set registration event
    function setEvent(event) {
      vm.eventregistrationrequest.person = {};
      vm.eventregistrationrequest.person.organization = event.organization;
      vm.eventregistrationrequest.event = event;
      vm.setEventPrice(event);
    }

    // Save EventRegistrationRequest
    function saveEventRegistrationRequest() {
      if (vm.eventregistrationrequest._id) {
        vm.eventregistrationrequest.$update(successCallback, errorCallback);
      } else {
        vm.eventregistrationrequest.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $rootScope.showLoadingSpinner = false;
        if (!vm.editMode) {
          $state.go('eventregistrationrequests.view', {
            'eventregistrationrequestId': res._id
          });
        } else {
          Notification.info({
            title: 'Operación ejecutada exitosamente!',
            message: 'Se creó/actualizó la solicitud # ' + res.requestNumber + ' correctamente.',
            delay: 15000
          });
          $state.go('eventregistrationrequests.list');
        }
      }

      function errorCallback(res) {
        $rootScope.showLoadingSpinner = false;
        vm.error = res.data.message;
        $anchorScroll(document.body.scrollTop);
      }
    }

    // Save Eventregistrationrequest
    function save(isValid) {
      $rootScope.showLoadingSpinner = true;
      if (!isValid) {
        $rootScope.showLoadingSpinner = false;
        $scope.$broadcast('show-errors-check-validity', 'vm.form.eventregistrationrequestForm');
        vm.error = 'Por favor completar los campos requeridos (*) y/o corregir los errores del formulario';

        Notification.clearAll();
        Notification.error({
          message: vm.error,
          title: '<i class="glyphicon glyphicon-remove"></i> Error en el formulario!',
          delay: 6000,
          replaceMessage: true
        });
        $anchorScroll(document.body.scrollTop);
        return false;
      }

      saveEventRegistrationRequest();
      
    }
  }
})();