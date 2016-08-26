(function() {
  'use strict';

  angular
    .module('receipts')
    .controller('ReceiptsListController', ReceiptsListController);

  ReceiptsListController.$inject = ['ReceiptsService', '$state', 'CurrentEventsService', 'EventregistrationsService',
    'Authentication', '$anchorScroll'
  ];

  function ReceiptsListController(ReceiptsService, $state, CurrentEventsService, EventregistrationsService,
    Authentication, $anchorScroll) {
    var vm = this;
    vm.authentication = Authentication;
    vm.events = CurrentEventsService.query();
    vm.receipts = ReceiptsService.query();
    vm.setEvent = setEvent;

    //set receipt event
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

    vm.getStatusClass = function(receipt) {
      if (receipt.paymentAmount >= 0) {
        return 'success';
      } else {
        return 'danger';
      }
    };
    // Remove existing Receipt
    vm.remove = function(receipt) {
      if (confirm('Está seguro que desea eliminar el recibo # ' + receipt.receiptNumber + ' ?')) {
        debugger;
        var eventRegistrationSuccessMsg = '';
        receipt.$remove(function() {
          if (vm.isEventRegistrationReceipt(receipt)) {
            vm.updateEventRegistration(receipt);
            eventRegistrationSuccessMsg = 'Y se actualizó el saldo de la inscripción # ' + receipt.eventRegistration.registrationNumber;
          }
          vm.success = 'Se eliminó el recibo #' + receipt.receiptNumber + '. ' + eventRegistrationSuccessMsg;
          vm.receipts = ReceiptsService.query();
          $anchorScroll(document.body.scrollTop);
        });
      }
    };

    vm.updateEventRegistration = function(receipt) {
      receipt.eventRegistration.balanceAmount += receipt.paymentAmount;
      EventregistrationsService.update({
        eventregistrationId: receipt.eventRegistration._id
      }, receipt.eventRegistration);
    };

    vm.isEventRegistrationReceipt = function(receipt) {
      return receipt.eventRegistration !== undefined;
    };
  }
})();