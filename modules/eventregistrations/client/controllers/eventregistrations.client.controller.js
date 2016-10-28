(function() {
  'use strict';

  // Eventregistrations controller
  angular
    .module('eventregistrations')
    .controller('EventregistrationsController', EventregistrationsController);

  EventregistrationsController.$inject = ['$scope', '$anchorScroll', '$state', '$stateParams', 'Authentication',
    'eventregistrationResolve', 'CurrentEventsService', 'EventpeoplegroupsService', 'personResolve',
    'PeopleService', 'EventregistrationsByEventService', '$rootScope', 'PersontypesService'
  ];

  function EventregistrationsController($scope, $anchorScroll, $state, $stateParams, Authentication, eventregistration,
    CurrentEventsService, EventpeoplegroupsService, person, PeopleService, EventregistrationsByEventService, $rootScope,
    PersontypesService) {
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
    vm.oldShirtsQuantity = vm.eventregistration.shirtsQuantity;
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
    init();

    function init() {
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
          debugger;
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
      if (!vm.eventregistration._id) {
        if (vm.eventregistration.isEventServer) {
          vm.eventregistration.balanceAmount = event.serverPrice;
          if (event.shirtPrice && vm.eventregistration.shirtsQuantity) {
            vm.eventregistration.balanceAmount += (event.shirtPrice * vm.eventregistration.shirtsQuantity);
          }
        } else if (vm.eventregistration.eventExternalServer.isEventExternalServer) {
          vm.eventregistration.balanceAmount = vm.eventregistration.eventExternalServer.specialPrice;
          if (event.shirtPrice && vm.eventregistration.shirtsQuantity) {
            vm.eventregistration.balanceAmount += (event.shirtPrice * vm.eventregistration.shirtsQuantity);
          }
        } else {
          if (event.shirtPrice && vm.eventregistration.shirtsQuantity) {
            vm.eventregistration.balanceAmount = event.price + (event.shirtPrice * vm.eventregistration.shirtsQuantity);
          } else {
            vm.eventregistration.balanceAmount = event.price;
          }
        }
      } else {
        var newShirtsQuantity = vm.eventregistration.shirtsQuantity - vm.oldShirtsQuantity;
        if (newShirtsQuantity === 0) {
          vm.eventregistration.balanceAmount = vm.oldBalanceAmount;
        } else {
          vm.eventregistration.balanceAmount = vm.oldBalanceAmount + (event.shirtPrice * newShirtsQuantity);
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
          $state.go('eventregistrations.list');
        }
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


      if (vm.isNewMemberRegistration()) {
        var query = {
          firstName: vm.person.firstName,
          lastName: vm.person.lastName,
          secondLastName: vm.person.secondLastName
        };
        var maxPeopleLength = 0;
        // if (vm.editMode) {
        //   maxPeopleLength = 1;
        //   query._id = vm.person._id;
        // }
        //verify if person names already exist
        PeopleService.query(query, function(data) {
          var continueOperation = true;
          var existingPersonIndex = -1;
          if (vm.editMode) {
            existingPersonIndex = _.findIndex(data, function(o) {
              return (o._id === vm.person._id);
            });
          }
          if (data.length > maxPeopleLength && existingPersonIndex < 0) {
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
            $anchorScroll(document.body.scrollTop);
          }
        });
      } else {
        savePerson();
      }

    }
  }
})();