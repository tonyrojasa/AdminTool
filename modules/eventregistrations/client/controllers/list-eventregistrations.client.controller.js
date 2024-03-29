(function() {
  'use strict';

  angular
    .module('eventregistrations')
    .controller('EventregistrationsListController', EventregistrationsListController);

  EventregistrationsListController.$inject = ['$rootScope', '$scope', 'CurrentEventregistrationsService', 'CurrentEventsService', 'Authentication',
    'ReceiptsByEventRegistrationService', '$anchorScroll', 'NgTableParams', '$filter', 'moment', 'EventpeoplegroupsService',
    'PersontypesService', 'EventregistrationsService', 'Notification'
  ];

  function EventregistrationsListController($rootScope, $scope, CurrentEventregistrationsService, CurrentEventsService, Authentication,
    ReceiptsByEventRegistrationService, $anchorScroll, NgTableParams, $filter, moment, EventpeoplegroupsService,
    PersontypesService, EventregistrationsService, Notification) {
    var vm = this;
    vm.moment = moment;
    vm.authentication = Authentication;


    vm.eventsFilterArray = [];
    vm.events = CurrentEventsService.query(function(data) {
      _.each(data, function(event) {
        vm.eventsFilterArray.push({
          id: event.name,
          title: event.name
        });
      });
    });

    vm.groupsFilterArray = [];
    EventpeoplegroupsService.query(function(data) {
      _.each(data, function(group) {
        vm.groupsFilterArray.push({
          id: group.name,
          title: group.name
        });
      });
    });

    vm.personTypesFilterArray = [];
    PersontypesService.query(function(data) {
      _.each(data, function(personType) {
        vm.personTypesFilterArray.push({
          id: personType.name,
          title: personType.name
        });
      });
    });

    $rootScope.showLoadingSpinner = true;
    vm.eventregistrations = CurrentEventregistrationsService.query(function(data) {
      if (data.length && data.length > 0) {
        vm.lastIndex = data.length - 1;
      } else {
        vm.lastIndex = 0;
        $rootScope.showLoadingSpinner = false;
      }
      _.each(data, function(eventregistration, index) {
        eventregistration.registrationDate = vm.moment(eventregistration.registrationDate).format('YYYY-MM-DD');
        if (index === vm.lastIndex) {
          $rootScope.showLoadingSpinner = false;
        }
      });
    }, function() {
      $rootScope.showLoadingSpinner = false;
    });
    vm.setEvent = setEvent;
    vm.remove = remove;
    vm.receiptsByEventRegistrationService = ReceiptsByEventRegistrationService;

    $scope.$watch('vm.registrationDate', function(newVal, oldVal) {
      if (newVal) {
        vm.dateFilterValue = vm.moment(vm.registrationDate).format('YYYY-MM-DD');
      } else {
        vm.dateFilterValue = '';
      }
      vm.tableParams.filter().registrationDate = vm.dateFilterValue;
    });

    vm.cols = [{
      field: "registrationNumber",
      title: function() {
        return "#";
      },
      show: function() {
        return true;
      }
    }, {
      field: "event.name",
      title: function() {
        return "Evento";
      },
      show: function() {
        return true;
      }
    }, {
      field: "registrationDate",
      title: function() {
        return "Fecha de Inscripción";
      },
      show: function() {
        return true;
      }
    }, {
      field: "eventPeopleGroup.name",
      title: function() {
        return "Grupo";
      },
      show: function() {
        return true;
      }
    }, {
      field: "person.firstName",
      title: function() {
        return "Nombre";
      },
      show: function() {
        return true;
      }
    }, {
      field: "person.lastName",
      title: function() {
        return "Apellido 1";
      },
      show: function() {
        return true;
      }
    }, {
      field: "person.secondLastName",
      title: function() {
        return "Apellido 2";
      },
      show: function() {
        return true;
      }
    }, {
      field: "person.personType.name",
      title: function() {
        return "Tipo de Persona";
      },
      show: function() {
        return true;
      }
    }, {
      field: "balanceAmount",
      title: function() {
        return "Saldo ₡ Pendiente";
      },
      show: function() {
        return true;
      }
    }];

    vm.isCollapsed = true;

    vm.tableParams = new NgTableParams({
      page: 1,
      count: 10
    }, {
      dataset: vm.eventregistrations
    });

    // vm.tableParams = new NgTableParams({
    //   page: 1,
    //   count: 10
    // }, {
    //   total: 0,
    //   getData: function(params) {
    //     var filter = params.filter();
    //     var sorting = params.sorting();
    //     var count = params.count();
    //     var page = params.page();
    //     // ajax request to api
    //     return CurrentEventregistrationsService.query().$promise.then(function(data) {
    //       params.total(data.length); // recal. page nav controls
    //       vm.eventregistrations = data;
    //       return data;
    //     });
    //   }
    // });

    //set registration event
    function setEvent(event) {
      vm.event = event;
    }
    vm.getTotalClass = function(value) {
      if (value >= 0) {
        return 'success';
      } else {
        return 'danger';
      }
    };

    vm.hasPendingPayment = function(eventRegistration) {
      return eventRegistration.balanceAmount > 0;
    };

    vm.getStatusClass = function(eventRegistration) {
      return vm.hasPendingPayment(eventRegistration) ? 'warning' : 'success';
    };

    // Remove existing Eventregistration
    function remove(eventRegistration) {
      if (confirm('Está seguro que desea eliminar la inscripción # ' + eventRegistration.registrationNumber + '?')) {
        vm.receiptsByEventRegistrationService.query({
          'eventRegistrationId': eventRegistration._id
        }, function(data) {
          if (data.length === 0) {
            EventregistrationsService.delete({
              'eventregistrationId': eventRegistration._id
            }, function() {
              vm.warning = 'Se eliminó la inscripción #' + eventRegistration.registrationNumber + '. ' +
                'Sin embargo, la persona ha sido creada en la base de datos. ' +
                'Si desea inscribir la misma persona, debe hacerlo por medio de la opción Miembro Existente. ' +
                'Si desea eliminar la persona de la base de datos, debe hacerlo desde el modulo de Personas.';
              _.remove(vm.eventregistrations, {
                _id: eventRegistration._id
              });
              vm.tableParams.reload();
              $anchorScroll(document.body.scrollTop);
              Notification.warning({
                title: 'Operación ejecutada exitosamente!',
                message: vm.warning,
                delay: 15000
              });
            });
          } else {
            vm.error = 'No se puede eliminar la inscripción #' + eventRegistration.registrationNumber + ' debido a que tiene recibos relacionados';
            Notification.error({
              title: 'Error al eliminar inscripción!',
              message: vm.error,
              delay: 10000
            });
          }
        });
      }
    }

  }
})();