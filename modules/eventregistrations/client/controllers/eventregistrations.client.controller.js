(function() {
  'use strict';

  // Eventregistrations controller
  angular
    .module('eventregistrations')
    .controller('EventregistrationsController', EventregistrationsController);

  EventregistrationsController.$inject = ['$scope', '$anchorScroll', '$state', '$stateParams', 'Authentication',
    'eventregistrationResolve', 'CurrentEventsService', 'EventpeoplegroupsService', 'personResolve',
    'PeopleService', 'EventregistrationsByEventService', '$rootScope', 'PersontypesService', 'Notification',
    'StudentsService'
  ];

  function EventregistrationsController($scope, $anchorScroll, $state, $stateParams, Authentication, eventregistration,
    CurrentEventsService, EventpeoplegroupsService, person, PeopleService, EventregistrationsByEventService, $rootScope,
    PersontypesService, Notification, StudentsService) {
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
    vm.clearEventSelection = clearEventSelection;
    vm.isSelectionDisabled = isSelectionDisabled;
    vm.setEventPrice = setEventPrice;
    vm.shirtQuantities = [0, 1, 2, 3, 4, 5];
    vm.setShirtsQuantity = function(shirtsQuantity) {
      vm.eventregistration.shirtsQuantity = shirtsQuantity;
      vm.setEventPrice(vm.eventregistration.event);
    };
    vm.quantities = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 ,18, 19, 20];
    vm.setQuantity = function(quantity) {
      vm.eventregistration.quantity = quantity;
      vm.setEventPrice(vm.eventregistration.event);
    };
    vm.oldShirtsQuantity = vm.eventregistration.shirtsQuantity;
    vm.oldQuantity = vm.eventregistration.quantity;
    vm.oldBalanceAmount = vm.eventregistration.balanceAmount;
    vm.shirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    vm.setShirtSize = function(shirtSize) {
      vm.person.shirtSize = shirtSize;
    };
    vm.personTypes = PersontypesService.query();
    vm.setPersonType = function(personType) {
      vm.eventregistration.personType = personType;
      if (vm.person && !vm.person.personType) {
        vm.person.personType = personType;
      }
    };
    vm.getShirtTypesQuantityMax = getShirtTypesQuantityMax;
    vm.isQuickRegistration = isQuickRegistration;
    vm.regularRegistrationRequiredFields = [
      'organization',
      'sex',
      'firstName',
      'lastName',
      'secondLastName',
      'address',
      'personType',
      'age',
      'maritalStatus'
    ];
    vm.quickRegistrationRequiredFields = [
      'personId',
      'organization',
      'sex',
      'firstName',
      'lastName',
      'secondLastName',
      'mobilePhone'
    ];
    init();

    function init() {
      vm.eventregistration.quantity = vm.eventregistration.quantity ? vm.eventregistration.quantity : 1;
      loadDates();
      setShirtTypes();
      if (!vm.isNewMemberRegistration()) {
        vm.person = undefined;
      } else {
        vm.person = person;
      }

      if (!vm.eventregistration.eventExternalServer) {
        vm.eventregistration.eventExternalServer = {
          isEventExternalServer: false,
          specialPrice: 0
        };
      }
    }

    function isQuickRegistration() {
      return vm.eventregistration.event && vm.eventregistration.event.quickRegistration;
    }

    function setShirtTypes() {
      if (!vm.editMode) {
        vm.eventregistration.shirtTypes = [];
      }
      if (vm.eventregistration.event && vm.eventregistration.event.shirtTypes.length > 0) {
        if (!vm.eventregistration.shirtTypes ||
          (vm.eventregistration.shirtTypes && vm.eventregistration.shirtTypes.length === 0)) {
          vm.eventregistration.shirtTypes = _.map(vm.eventregistration.event.shirtTypes, function(shirtType) {
            shirtType.quantity = 0;
            return shirtType;
          });
        } else {
          _.each(vm.eventregistration.event.shirtTypes, function(shirtType) {
            var existingShirtTypeIndex = _.findIndex(vm.eventregistration.shirtTypes, function(o) {
              return (o.shirtTypeName === shirtType.shirtTypeName &&
                o.shirtTypeColor === shirtType.shirtTypeColor);
            });
            if (existingShirtTypeIndex < 0) {
              shirtType.quantity = 0;
              vm.eventregistration.shirtTypes.push(shirtType);
            }
          });
        }
      }
    }

    function getShirtTypesQuantityMax(selectedShirtType) {
      var TotalShirtTypesQuantity = 0;
      vm.eventregistration.shirtTypes.forEach(function(shirtType, key) {
        if (shirtType.quantity) {
          TotalShirtTypesQuantity += shirtType.quantity;
        }
      });
      if (TotalShirtTypesQuantity > vm.eventregistration.shirtsQuantity) {
        selectedShirtType.$setValidity("maxQuantity", false);
      } else {
        selectedShirtType.$setValidity("maxQuantity", true);
      }
      if (TotalShirtTypesQuantity < vm.eventregistration.shirtsQuantity) {
        selectedShirtType.$setValidity("minQuantity", false);
      } else {
        selectedShirtType.$setValidity("minQuantity", true);
      }
    }

    function setEventPrice(event) {
      if (!vm.eventregistration._id) {//if new eventregistration
        if (vm.eventregistration.isEventServer) {// for event server registration 
          vm.eventregistration.balanceAmount = event.serverPrice;
          if (event.shirtPrice && vm.eventregistration.shirtsQuantity) {
            vm.eventregistration.balanceAmount += (event.shirtPrice * vm.eventregistration.shirtsQuantity);
          }
        } else if (vm.eventregistration.eventExternalServer.isEventExternalServer) { //for external server
          vm.eventregistration.balanceAmount = vm.eventregistration.eventExternalServer.specialPrice;
          if (event.shirtPrice && vm.eventregistration.shirtsQuantity) {
            vm.eventregistration.balanceAmount += (event.shirtPrice * vm.eventregistration.shirtsQuantity);
          }
        } else { //normal event registration price
          if (event.shirtPrice && vm.eventregistration.shirtsQuantity) {
            vm.eventregistration.balanceAmount = (event.price * vm.eventregistration.quantity) + 
              (event.shirtPrice * vm.eventregistration.shirtsQuantity);
          } else {
            vm.eventregistration.balanceAmount = event.price * vm.eventregistration.quantity;
          }
        }
      } else {//if existing eventregistration
        //shirt price calculation
        var newShirtsQuantity = vm.eventregistration.shirtsQuantity - vm.oldShirtsQuantity;
        if (newShirtsQuantity === 0) {
          vm.eventregistration.balanceAmount = vm.oldBalanceAmount;
        } else {
          vm.eventregistration.balanceAmount = vm.oldBalanceAmount + (event.shirtPrice * newShirtsQuantity);
        }
        //event price calculation
        var newQuantity = vm.eventregistration.quantity - vm.oldQuantity;
        if (newQuantity === 0) {
          vm.eventregistration.balanceAmount = vm.oldBalanceAmount;
        } else {
          vm.eventregistration.balanceAmount = vm.oldBalanceAmount + (event.price * newQuantity);
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

    function isSelectionDisabled() {
      if (!vm.eventregistration._id || (vm.eventregistration._id && vm.authentication.isUserAdmin())) {
        return false;
      }
      return true;
    }

    function clearEventSelection() {
      vm.eventregistration.event = undefined;
      vm.person = vm.isNewMemberRegistration() ? vm.person : undefined;
      vm.eventregistration.isEventServer = undefined;
      vm.eventregistration.eventExternalServer.isEventExternalServer = undefined;
      vm.eventregistration.balanceAmount = vm.eventregistration._id ? vm.eventregistration.balanceAmount : undefined;
    }

    //set registration event
    function setEvent(event) {
      vm.person = vm.isNewMemberRegistration() ? vm.person : undefined;
      vm.eventregistration.event = event;
      if (event.shirtPrice && event.shirtPrice > 0) {
        vm.eventregistration.shirtsQuantity = 1;
      } else {
        vm.eventregistration.shirtsQuantity = 0;
      }
      vm.setEventPrice(event);
      setShirtTypes();

      if (!vm.isNewMemberRegistration()) {
        PeopleService.query(null, function(data) {
          vm.people = data;
          vm.eventRegistrations = EventregistrationsByEventService.query({
            'eventId': event._id
          }, function(data) {
            filterPeopleListBySelectedEvent(vm.people, data);
          });
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
        saveStudent();
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
        if (!vm.editMode) {
          $state.go('receipts.createFromEventRegistration', {
            'eventregistrationId': res._id
          });
        } else {
          Notification.info({
            title: 'Operación ejecutada exitosamente!',
            message: 'Se creó/actualizó la inscripción # ' + res.registrationNumber + ' correctamente.',
            delay: 15000
          });
          $state.go('eventregistrations.list');
        }
      }

      function errorCallback(res) {
        $rootScope.showLoadingSpinner = false;
        vm.error = res.data.message;
        $anchorScroll(document.body.scrollTop);
      }
    }

    // Save Person
    function saveStudent() {
      if (vm.eventregistration.event.serviceAcademyClass) {
        if (!vm.eventregistration._id) { //create student
          var student = {
            person: vm.eventregistration.person._id,
            serviceAcademyClass: vm.eventregistration.event.serviceAcademyClass
          };
          StudentsService.create(student, successStudentCallback, errorStudentCallback);
        }
      }

      function successStudentCallback(res) {
        Notification.info({
          message: 'Se registró la persona en la academia asignada a este evento.',
          title: 'Estudiante agregado!',
          delay: 6000
        });
      }

      function errorStudentCallback(res) {
        $rootScope.showSpinner = false;
        Notification.error({
          message: 'No se pudo registrar la persona en la academia asignada a este evento. ' +
            'Debe agregarla manualmente',
          title: '<i class="glyphicon glyphicon-remove"></i> Error al agregar al estudiante!',
          delay: 6000
        });
        $anchorScroll(document.body.scrollTop);
      }
    }

    // Save Eventregistration
    function save(isValid) {
      $rootScope.showLoadingSpinner = true;
      if (!isValid) {
        $rootScope.showLoadingSpinner = false;
        $scope.$broadcast('show-errors-check-validity', 'vm.form.eventregistrationForm');
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


      if (vm.isNewMemberRegistration()) {
        var query = {
          firstName: vm.person.firstName,
          lastName: vm.person.lastName,
          secondLastName: vm.person.secondLastName
        };

        //verify if person names already exist
        PeopleService.query(query, function(data) {
          var continueOperation = true;
          var existingPersonIndex = -1;
          if (vm.editMode) {
            existingPersonIndex = _.findIndex(data, function(o) {
              return (o._id === vm.person._id &&
                o.firstName === vm.person.firstName &&
                o.lastName === vm.person.lastName &&
                o.secondLastName === vm.person.secondLastName);
            });
          }
          if (data.length > 0 && existingPersonIndex < 0) {
            continueOperation = confirm('Ya existe una persona con el nombre: ' +
              vm.person.firstName + ' ' + vm.person.lastName + ' ' + vm.person.secondLastName + '. ' +
              '¿Desea continuar de todas formas?');
          }
          if (continueOperation) {
            savePerson();
          } else {
            $rootScope.showLoadingSpinner = false;
            vm.warning = 'Operación cancelada por el usuario debido a que existe una persona con el mismo nombre. ' +
              'Verifique la información e intente de nuevo. Si desea inscribir una persona existente en la base de datos, ' +
              'utilice la opción: <a class="btn btn-secondary" href="/eventregistrations/create/false">Miembro Existente</a>';
            Notification.warning({
              message: vm.warning,
              title: 'Mensaje importante!',
              delay: 6000,
              replaceMessage: true
            });
            $anchorScroll(document.body.scrollTop);
          }
        }, errorResponse);
      } else {
        savePerson();
      }

    }

    function errorResponse(error) {
      $rootScope.showLoadingSpinner = false;
      vm.error = 'Por favor verifique su conexión de Internet e intente de nuevo.';
      $anchorScroll(document.body.scrollTop);
    }
  }
})();