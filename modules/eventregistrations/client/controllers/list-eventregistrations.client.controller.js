(function() {
  'use strict';

  angular
    .module('eventregistrations')
    .controller('EventregistrationsListController', EventregistrationsListController);

  EventregistrationsListController.$inject = ['$scope', 'EventregistrationsService', 'EventsService', 'Authentication',
    'ReceiptsByEventRegistrationService', '$anchorScroll', 'NgTableParams'
  ];

  function EventregistrationsListController($scope, EventregistrationsService, EventsService, Authentication,
    ReceiptsByEventRegistrationService, $anchorScroll, NgTableParams) {
    var vm = this;
    vm.authentication = Authentication;
    vm.events = EventsService.query();
    vm.eventregistrations = EventregistrationsService.query();
    vm.setEvent = setEvent;
    vm.remove = remove;
    vm.receiptsByEventRegistrationService = ReceiptsByEventRegistrationService;

    vm.cols = [{
      field: "registrationNumber",
      title: "#",
      show: true
    }, {
      field: "event.name",
      title: "Evento",
      show: true
    }, {
      field: "registrationDate",
      title: "Fecha de Inscripción",
      show: true
    }, {
      field: "eventPeopleGroup.name",
      title: "Grupo",
      show: false
    }, {
      field: "person.firstName",
      title: "Nombre",
      show: true
    }, {
      field: "person.lastName",
      title: "Apellido 1",
      show: true
    }, {
      field: "person.secondLastName",
      title: "Apellido 2",
      show: true
    }, {
      field: "person.personType.name",
      title: "Tipo de Persona",
      show: true
    }, {
      field: "balanceAmount",
      title: "Saldo ₡",
      show: true
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
    //     return EventregistrationsService.query().$promise.then(function(data) {
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
            eventRegistration.$remove(function() {
              vm.warning = 'Se eliminó la inscripción #' + eventRegistration.registrationNumber + '. ' +
                'Sin embargo, la persona ha sido creada en la base de datos. ' +
                'Si desea inscribir la misma persona, debe hacerlo por medio de la opción Miembro Existente';
              vm.eventregistrations = EventregistrationsService.query();
              $anchorScroll(document.body.scrollTop);
            });
          } else {
            vm.error = 'No se puede eliminar la inscripción #' + eventRegistration.registrationNumber + ' debido a que tiene recibos relacionados';
          }
        });
      }
    }

  }
})();