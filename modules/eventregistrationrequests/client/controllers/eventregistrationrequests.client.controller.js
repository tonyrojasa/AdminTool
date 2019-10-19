(function () {
  'use strict';

  // Eventregistrationrequests controller
  angular
    .module('eventregistrationrequests')
    .controller('EventregistrationrequestsController', EventregistrationrequestsController);

  EventregistrationrequestsController.$inject = ['$scope', '$anchorScroll', '$state', '$stateParams', 'Authentication',
    'eventregistrationrequestResolve', 'CurrentEventsService', 'EventpeoplegroupsService',
    'PeopleService', 'EventregistrationrequestsByEventService', '$rootScope', 'PersontypesService', 'Notification',
    'StudentsService', '$filter', 'PeopleDataService', '$window'
  ];

  function EventregistrationrequestsController($scope, $anchorScroll, $state, $stateParams, Authentication, eventregistrationrequest,
    CurrentEventsService, EventpeoplegroupsService, PeopleService, EventregistrationrequestsByEventService, $rootScope,
    PersontypesService, Notification, StudentsService, $filter, PeopleDataService, $window) {
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
    }

    function isQuickRegistration() {
      return vm.eventregistrationrequest.event && vm.eventregistrationrequest.event.quickRegistration;
    }

    function setEventPrice(event) {
      let eventPrice = event.price ? event.price : 0;
      let shirtPrice = event.shirtPrice ? event.shirtPrice : 0;
      
      vm.eventPrice = eventPrice  + shirtPrice;
      vm.serverPrice = event.serverPrice ? event.serverPrice : 0;
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

    vm.onFindMyDataKeyPress = function($event){
      if ($event.which === 13){
        vm.findMyDataChange(vm.findMyDataFilter);
        event.preventDefault();
      }
    }

    vm.findMyDataChange = function(findMyDataFilter){
      $rootScope.showLoadingSpinner = true;   
      vm.findMyDataError = null;
      if(!vm.isValidFindMyDataFilter(findMyDataFilter)) {
        vm.findMyDataError = "Debe ingresar mas al menos 9 caracteres";
        vm.findMyDataResults = null;
        $rootScope.showLoadingSpinner = false;   
        return;
      }
      PeopleDataService(findMyDataFilter).then(function (response) {
        vm.findMyDataResults = response && response.data ? response.data.results : null;
        $rootScope.showLoadingSpinner = false;
      }, function (error) {
        vm.findMyDataError = 'Ocurrió un error al buscar los datos, intentar de nuevo o llenar los campos manualmente.';
        $rootScope.showLoadingSpinner = false;
      });
    };

    vm.populateMyData = function(mydataRow) {  
      vm.eventregistrationrequest.person.personId = mydataRow.cedula;
      vm.eventregistrationrequest.person.firstName = mydataRow.firstname;
      vm.eventregistrationrequest.person.lastName = mydataRow.lastname1;
      vm.eventregistrationrequest.person.secondLastName = mydataRow.lastname2;
      vm.selectedMyDatRow = mydataRow;

      $window.document.getElementById('personId').focus();
    };

    vm.isValidFindMyDataFilter = function(findMyDataFilter){
      return findMyDataFilter != null && findMyDataFilter.length >= 9
    };

    vm.getMyDataRowClass = function(myDataRow) {
      return vm.selectedMyDatRow == myDataRow ? 'info': '';
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
      vm.eventregistrationrequest.person = vm.eventregistrationrequest.person ? vm.eventregistrationrequest.person : {};
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
        if(res.error){
          debugger;
          let error = res.error && res.error === 'personId already exist in this event' ? 'La persona ya realizo la inscripción a este evento' : res.error;
          vm.error = error;
          $anchorScroll(document.body.scrollTop);
        }else {
          if (!vm.editMode) {
            Notification.info({
              title: 'Operación ejecutada exitosamente!',
              message: 'Se actualizó la solicitud # ' + res.requestNumber + ' correctamente.',
              delay: 15000
            });
          } else {
            Notification.info({
              title: 'Operación ejecutada exitosamente!',
              message: 'Se creó la solicitud # ' + res.requestNumber + ' correctamente.',
              delay: 15000
            });
          }
          $state.go('eventregistrationrequests.view', {
            eventregistrationrequestId: res._id
          });
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