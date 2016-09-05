(function() {
  'use strict';

  angular
    .module('receipts')
    .controller('ReceiptsListController', ReceiptsListController);

  ReceiptsListController.$inject = ['ReceiptsService', '$state', 'CurrentEventsService', 'EventregistrationsService',
    'Authentication', '$anchorScroll', 'NgTableParams'
  ];

  function ReceiptsListController(ReceiptsService, $state, CurrentEventsService, EventregistrationsService,
    Authentication, $anchorScroll, NgTableParams) {
    var vm = this;
    vm.authentication = Authentication;
    vm.events = CurrentEventsService.query();
    vm.receipts = ReceiptsService.query();
    vm.setEvent = setEvent;

    vm.cols = [{
      field: "eventRegistration.registrationNumber",
      title: function() {
        return "# Inscripción";
      },
      show: function() {
        return true;
      }
    }, {
      field: "receiptNumber",
      title: function() {
        return "# Recibo";
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
      field: "paymentOf",
      title: function() {
        return "Por concepto de";
      },
      show: function() {
        return true;
      }
    }, {
      field: "paymentDate",
      title: function() {
        return "Fecha de pago";
      },
      show: function() {
        return true;
      }
    }, {
      field: "receivedFrom",
      title: function() {
        return "Recibido de";
      },
      show: function() {
        return true;
      }
    }, {
      field: "otherReference",
      title: function() {
        return "Otra referencia";
      },
      show: function() {
        return false;
      }
    }, {
      field: "paymentAmount",
      title: function() {
        return "Monto ₡ Ingreso/Gasto";
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
      dataset: vm.receipts
    });

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
        var eventRegistrationSuccessMsg = '';
        receipt.$remove(function() {
          if (vm.isEventRegistrationReceipt(receipt)) {
            vm.updateEventRegistration(receipt);
            eventRegistrationSuccessMsg = 'Y se actualizó el saldo de la inscripción # ' + receipt.eventRegistration.registrationNumber;
          }
          vm.success = 'Se eliminó el recibo #' + receipt.receiptNumber + '. ' + eventRegistrationSuccessMsg;
          _.remove(vm.receipts, {
            _id: receipt._id
          });
          vm.tableParams.reload();
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