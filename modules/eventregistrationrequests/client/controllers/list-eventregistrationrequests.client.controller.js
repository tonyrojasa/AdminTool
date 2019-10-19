(function () {
  'use strict';

  angular
    .module('eventregistrationrequests')
    .controller('EventregistrationrequestsListController', EventregistrationrequestsListController);

  EventregistrationrequestsListController.$inject = ['$rootScope', '$scope', 'EventregistrationrequestsService', 'CurrentEventsService', 'Authentication',
    'ReceiptsByEventRegistrationService', '$anchorScroll', 'NgTableParams', '$filter', 'moment',
    'PersontypesService', 'Notification', 'PeopleDataService'
  ];

  function EventregistrationrequestsListController($rootScope, $scope, EventregistrationrequestsService, CurrentEventsService, Authentication,
    ReceiptsByEventRegistrationService, $anchorScroll, NgTableParams, $filter, moment,
    PersontypesService, Notification, PeopleDataService) {
    var vm = this;
    vm.moment = moment;
    vm.authentication = Authentication;

    vm.eventsFilterArray = [];
    vm.events = CurrentEventsService.query(function (data) {
      _.each(data, function (event) {
        vm.eventsFilterArray.push({
          id: event.name,
          title: event.name
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
    vm.eventregistrationrequests = EventregistrationrequestsService.query(function (data) {
      if (data.length && data.length > 0) {
        vm.lastIndex = data.length - 1;
      } else {
        vm.lastIndex = 0;
        $rootScope.showLoadingSpinner = false;
      }
      _.each(data, function (eventregistrationrequest, index) {
        eventregistrationrequest.requestDate = vm.moment(eventregistrationrequest.requestDate).format('YYYY-MM-DD');
        if (index === vm.lastIndex) {
          vm.originalData = angular.copy(data);
        }
      });
      $rootScope.showLoadingSpinner = false;
    }, function () {
      $rootScope.showLoadingSpinner = false;
    });
    vm.setEvent = setEvent;
    vm.remove = remove;
    vm.receiptsByEventRegistrationService = ReceiptsByEventRegistrationService;

    $scope.$watch('vm.requestDate', function (newVal, oldVal) {
      if (newVal) {
        vm.dateFilterValue = vm.moment(vm.requestDate).format('YYYY-MM-DD');
      } else {
        vm.dateFilterValue = '';
      }
      vm.tableParams.filter().requestDate = vm.dateFilterValue;
    });

    vm.cols = [{
      field: "requestNumber",
      title: function () {
        return "# Solicitud";
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
      field: "requestDate",
      title: function () {
        return "Fecha de Inscripción";
      },
      show: function () {
        return true;
      }
    }, {
      field: "person.personId",
      title: function () {
        return "Cédula";
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
      field: "paymentInformation.paymentAmount",
      title: function () {
        return "Pago Reportado ₡";
      },
      show: function () {
        return true;
      }
    }, {
      field: "paymentInformation.confirmationCode",
      title: function () {
        return "Comprobante de Pago";
      },
      show: function () {
        return true;
      }
    }, {
      field: "paymentInformation.paymentDate",
      title: function () {
        return "Fecha de Pago";
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

    //set registration event
    function setEvent(event) {
      vm.event = event;
    }

    vm.hasPendingPayment = function (eventRegistration) {
      return eventRegistration.balanceAmount > 0;
    };

    // Remove existing Eventregistration
    function remove(eventRegistration) {
      if (confirm('Está seguro que desea eliminar la Solicitud # ' + eventRegistration.requestNumber + '?')) {        
        EventregistrationrequestsService.delete({
          'eventregistrationrequestId': eventRegistration._id
        }, function () {
          vm.warning = 'Se eliminó la solicitud #' + eventRegistration.requestNumber + '. ';
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
      }
    }
  }
})();