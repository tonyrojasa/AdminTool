(function () {
  'use strict';

  angular
    .module('eventregistrationrequests')
    .controller('EventregistrationrequestsListController', EventregistrationrequestsListController);

  EventregistrationrequestsListController.$inject = ['$rootScope', '$scope', 'CurrentEventregistrationsService', 'CurrentEventsService', 'Authentication',
    'ReceiptsByEventRegistrationService', '$anchorScroll', 'NgTableParams', '$filter', 'moment', 'EventpeoplegroupsService',
    'PersontypesService', 'EventregistrationsService', 'Notification', 'PeopleDataService'
  ];

  function EventregistrationrequestsListController($rootScope, $scope, CurrentEventregistrationsService, CurrentEventsService, Authentication,
    ReceiptsByEventRegistrationService, $anchorScroll, NgTableParams, $filter, moment, EventpeoplegroupsService,
    PersontypesService, EventregistrationsService, Notification, PeopleDataService) {
    var vm = this;
    vm.moment = moment;
    vm.authentication = Authentication;

    /*debugger;
    PeopleDataService(113700860).then(function (result) {
      debugger;
    }, function (error) {
      debugger;
    });*/

    vm.eventsFilterArray = [];
    vm.events = CurrentEventsService.query(function (data) {
      _.each(data, function (event) {
        vm.eventsFilterArray.push({
          id: event.name,
          title: event.name
        });
      });
    });

    vm.groupsFilterArray = [];
    EventpeoplegroupsService.query(function (data) {
      _.each(data, function (group) {
        vm.groupsFilterArray.push({
          id: group.name,
          title: group.name
        });
      });
    });

    vm.personTypesFilterArray = [];
    PersontypesService.query(function (data) {
      _.each(data, function (personType) {
        vm.personTypesFilterArray.push({
          id: personType.name,
          title: personType.name
        });
      });
    });

    $rootScope.showLoadingSpinner = true;
    vm.eventregistrationrequests = CurrentEventregistrationsService.query(function (data) {
      if (data.length && data.length > 0) {
        vm.lastIndex = data.length - 1;
      } else {
        vm.lastIndex = 0;
        $rootScope.showLoadingSpinner = false;
      }
      _.each(data, function (eventregistration, index) {
        eventregistration.registrationDate = vm.moment(eventregistration.registrationDate).format('YYYY-MM-DD');
        if (index === vm.lastIndex) {
          vm.originalData = angular.copy(data);
          $rootScope.showLoadingSpinner = false;
        }
      });
    }, function () {
      $rootScope.showLoadingSpinner = false;
    });
    vm.setEvent = setEvent;
    vm.remove = remove;
    vm.receiptsByEventRegistrationService = ReceiptsByEventRegistrationService;

    $scope.$watch('vm.registrationDate', function (newVal, oldVal) {
      if (newVal) {
        vm.dateFilterValue = vm.moment(vm.registrationDate).format('YYYY-MM-DD');
      } else {
        vm.dateFilterValue = '';
      }
      vm.tableParams.filter().registrationDate = vm.dateFilterValue;
    });

    vm.eventRegistrationStatuses = ["En cobro", "Entregado"]

    vm.filterEventRegistrationStatuses = [
      { id: "En cobro", title: " En cobro" },
      { id: "Entregado", title: "Entregado" }];


    vm.cols = [{
      field: "registrationNumber",
      title: function () {
        return "#";
      },
      show: function () {
        return true;
      }
    }, {
      field: "event.name",
      title: function () {
        return "Evento";
      },
      show: function () {
        return true;
      }
    }, {
      field: "registrationDate",
      title: function () {
        return "Fecha de Inscripción";
      },
      show: function () {
        return true;
      }
    }, {
      field: "eventPeopleGroup.name",
      title: function () {
        return "Grupo";
      },
      show: function () {
        return true;
      }
    }, {
      field: "person.firstName",
      title: function () {
        return "Nombre";
      },
      show: function () {
        return true;
      }
    }, {
      field: "person.lastName",
      title: function () {
        return "Apellido 1";
      },
      show: function () {
        return true;
      }
    }, {
      field: "person.secondLastName",
      title: function () {
        return "Apellido 2";
      },
      show: function () {
        return true;
      }
    }, {
      field: "person.personType.name",
      title: function () {
        return "Tipo de Persona";
      },
      show: function () {
        return true;
      }
    }, {
      field: "quantity",
      title: function () {
        return "Cant. Inscripciones";
      },
      show: function () {
        return true;
      }
    }, {
      field: "balanceAmount",
      title: function () {
        return "Saldo ₡ Pendiente";
      },
      show: function () {
        return true;
      }
    }];

    vm.isCollapsed = true;

    vm.tableParams = new NgTableParams({
      page: 1,
      count: 10
    }, {
        dataset: vm.eventregistrationrequests
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
    //       vm.eventregistrationrequests = data;
    //       return data;
    //     });
    //   }
    // });

    //set registration event
    function setEvent(event) {
      vm.event = event;
    }
    vm.getTotalClass = function (value) {
      if (value >= 0) {
        return 'success';
      } else {
        return 'danger';
      }
    };

    vm.hasPendingPayment = function (eventRegistration) {
      return eventRegistration.balanceAmount > 0;
    };

    vm.getStatusClass = function (eventRegistration) {
      var hasPendingPayment = vm.hasPendingPayment(eventRegistration);
      if (hasPendingPayment && eventRegistration.status !== 'Entregado') {
        return 'warning';
      } else if (hasPendingPayment && eventRegistration.status === 'Entregado') {
        return 'danger'
      } else if (eventRegistration.status === 'Entregado') {
        return 'info'
      } else {
        return 'success';
      }
    };

    // Remove existing Eventregistration
    function remove(eventRegistration) {
      if (confirm('Está seguro que desea eliminar la inscripción # ' + eventRegistration.registrationNumber + '?')) {
        vm.receiptsByEventRegistrationService.query({
          'eventRegistrationId': eventRegistration._id
        }, function (data) {
          if (data.length === 0) {
            EventregistrationsService.delete({
              'eventregistrationId': eventRegistration._id
            }, function () {
              vm.warning = 'Se eliminó la inscripción #' + eventRegistration.registrationNumber + '. ' +
                'Sin embargo, la persona ha sido creada en la base de datos. ' +
                'Si desea inscribir la misma persona, debe hacerlo por medio de la opción Miembro Existente. ' +
                'Si desea eliminar la persona de la base de datos, debe hacerlo desde el modulo de Personas.';
              _.remove(vm.eventregistrationrequests, {
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

    vm.update = function save(row, rowForm) {
      var originalDataRow = angular.copy(row);
      var originalRow = resetRow(row, rowForm);
      _.merge(originalRow, row);
      var successMessage = 'Se actualizaron datos la inscripción # ' + row.registrationNumber;
      vm.updateEventRegistration(row, successMessage).then(function () {
        //vm.tableParams.reload();
      }, function () {
        _.merge(row, originalDataRow);
      });
    };

    vm.updateStatus = function (eventRegistration, status) {
      if (eventRegistration.status !== status) {
        eventRegistration.status = status;
        var successMessage = 'El nuevo estado de la inscripción # ' + eventRegistration.registrationNumber +
          ' es: ' + eventRegistration.status;
        vm.updateEventRegistration(eventRegistration, successMessage);
      }
    }

    vm.updateEventRegistration = function (eventRegistration, successMessage) {
      $rootScope.showLoadingSpinner = true;

      function successCallback(res) {
        $rootScope.showLoadingSpinner = false;
        Notification.info({
          title: 'Inscripción actualizada exitosamente!',
          message: successMessage,
          delay: 1000
        });
      }

      function errorCallback(res) {
        vm.tableParams.reload();
        $rootScope.showLoadingSpinner = false;
        Notification.error({
          title: 'Error al actualizar inscripción!',
          message: 'No se pudo actualizar la inscripción # ' + eventRegistration.registrationNumber,
          delay: 15000
        });
      }

      return eventRegistration.$update(successCallback, errorCallback);
    };

    vm.cancel = function cancel(row, rowForm) {
      var originalRow = resetRow(row, rowForm);
      _.merge(row, originalRow);
    };

    function resetRow(row, rowForm) {
      row.isEditing = false;
      rowForm.$setPristine();
      //vm.tableTracker.untrack(row);
      return _.find(vm.originalData, function (r) {
        return r._id === row._id;
      });
    }
  }
})();