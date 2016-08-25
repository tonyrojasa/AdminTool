(function() {
  'use strict';

  angular
    .module('eventregistrations')
    .controller('EventregistrationsListController', EventregistrationsListController);

  EventregistrationsListController.$inject = ['$scope', 'EventregistrationsService', 'EventsService', 'Authentication',
    'ReceiptsByEventRegistrationService', '$anchorScroll'
  ];

  function EventregistrationsListController($scope, EventregistrationsService, EventsService, Authentication,
    ReceiptsByEventRegistrationService, $anchorScroll) {
    var vm = this;
    vm.authentication = Authentication;
    vm.events = EventsService.query();
    vm.eventregistrations = EventregistrationsService.query();
    vm.setEvent = setEvent;
    vm.remove = remove;
    vm.receiptsByEventRegistrationService = ReceiptsByEventRegistrationService;

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
      if (confirm('Está seguro que desea eliminar la inscripción seleccionada?')) {
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