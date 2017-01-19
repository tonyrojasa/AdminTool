(function() {
  'use strict';

  // Receipts controller
  angular
    .module('receipts')
    .controller('ReceiptsController', ReceiptsController);

  ReceiptsController.$inject = ['$rootScope', '$scope', '$state', 'Authentication', 'receiptResolve', 'EventsService',
    'eventregistrationResolve', 'EventregistrationsService', '$stateParams'
  ];

  function ReceiptsController($rootScope, $scope, $state, Authentication, receipt, EventsService, eventregistration,
    EventregistrationsService, $stateParams) {
    var vm = this;

    vm.success = $stateParams.successMessage;

    vm.authentication = Authentication;
    vm.receipt = receipt;
    vm.eventregistration = eventregistration;
    vm.error = null;
    vm.form = {};
    vm.events = EventsService.query();
    vm.remove = remove;
    vm.save = save;
    vm.initReceipt = initReceipt;
    vm.onIsDebitClicked = onIsDebitClicked;
    vm.calculateBalanceDue = calculateBalanceDue;

    function onIsDebitClicked() {
      if (vm.receipt.isDebit && !vm.isEventRegistrationPayment) {
        vm.receipt.currentBalance = 0;
      }
      if (vm.receipt.paymentAmount) {
        vm.receipt.paymentAmount = vm.receipt.paymentAmount * -1;
      }
      calculateBalanceDue();
    }

    function calculateBalanceDue() {
      if (vm.receipt.isDebit && vm.receipt.paymentAmount > 0) {
        vm.receipt.paymentAmount = -vm.receipt.paymentAmount;
      }

      if (vm.receipt.isDebit && vm.receipt.currentBalance === 0) {
        vm.receipt.balanceDue = 0;
      } else {
        vm.receipt.balanceDue = vm.receipt.currentBalance - vm.receipt.paymentAmount;
      }
      return vm.receipt.balanceDue;
    }

    function initReceipt() {
      vm.paymentOfList = [
        'Abono',
        'Cancelación',
        'Devolución',
        'Ingreso - Ofrenda',
        'Gasto',
        'Otro'
      ];
      vm.paidByList = [
        'Efectivo',
        'Cheque',
        'Tarjeta',
        'Transferencia',
        'Otro'
      ];
      vm.receipt.paidBy = vm.receipt.paidBy ? vm.receipt.paidBy : 'Efectivo'; //default value
      //default to current user
      if (!vm.receipt.receivedBy) {
        vm.receipt.receivedBy = vm.authentication.user.displayName;
      }

      if (vm.receipt._id) {
        vm.eventregistration = receipt.eventRegistration;
        if (vm.eventregistration) {
          EventregistrationsService.get({
            eventregistrationId: receipt.eventRegistration._id
          }, function(data) {
            vm.eventregistration = data;
          });
        }
      }

      if (vm.isNewEventRegistration()) {
        vm.isEventRegistrationPayment = true;
        vm.receipt.event = vm.eventregistration.event;
        vm.receipt.receivedFrom = vm.eventregistration.person.firstName + ' ' +
          vm.eventregistration.person.lastName + ' ' + vm.eventregistration.person.secondLastName;
        vm.receipt.currentBalance = vm.eventregistration.balanceAmount;
      }

      if (vm.receipt.paymentDate) {
        vm.receipt.paymentDate = new Date(vm.receipt.paymentDate);
      } else {
        vm.receipt.paymentDate = new Date();

      }

      if (vm.eventregistration || vm.receipt.eventRegistration) {
        vm.isEventRegistrationPayment = true;
      } else {
        vm.isEventRegistrationPayment = false;
      }
    }

    vm.isNewEventRegistration = function() {
      return (vm.eventregistration && !vm.receipt.eventRegistration);
    };

    vm.isEventServerReceipt = function() {
      return (vm.receipt.eventRegistration && vm.receipt.eventRegistration.shirtsQuantity &&
        (vm.receipt.eventRegistration.isEventServer ||
          vm.receipt.eventRegistration.eventExternalServer.isEventExternalServer));
    };

    vm.setPaymentOf = function(paymentOf) {
      vm.receipt.paymentOf = paymentOf;
    };

    vm.setPaidBy = function(paidBy) {
      vm.receipt.paidBy = paidBy;
    };

    //set registration event
    vm.setEvent = function(event) {
      vm.receipt.event = event;
    };

    //set registration event
    vm.setEventRegistrationEvent = function(event) {
      vm.receipt.eventRegistration.event = event;
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
          vm.success = 'Este recibo ha sido eliminado. ' + eventRegistrationSuccessMsg + ', haga click en el link de recibos para volver a la lista.';
        });
      }
    };

    // Remove existing Receipt
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.receipt.$remove($state.go('receipts.list'));
      }
    }

    vm.updateEventRegistration = function(receipt) {
      receipt.eventRegistration.balanceAmount += receipt.paymentAmount;
      EventregistrationsService.update({
        eventregistrationId: receipt.eventRegistration._id
      }, receipt.eventRegistration);
    };

    vm.isEventRegistrationReceipt = function(receipt) {
      return receipt.eventRegistration !== undefined;
    };

    // Save EventRegistration (if null only save receipt)
    function saveEventRegistration() {
      if (vm.isEventRegistrationPayment) {
        vm.eventregistration.balanceAmount = vm.calculateBalanceDue();
        vm.eventregistration.$update(successCallback, errorCallback);
      } else {
        saveReceipt();
      }

      function successCallback(res) {
        $rootScope.showLoadingSpinner = false;
        vm.receipt.eventRegistration = res;
        saveReceipt();
      }

      function errorCallback(res) {
        $rootScope.showLoadingSpinner = false;
        vm.error = res.data.message;
      }
    }

    // Save Receipt
    function saveReceipt() {
      if (vm.receipt._id) {
        vm.receipt.$update(successCallback, errorCallback);
      } else {
        vm.receipt.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $rootScope.showLoadingSpinner = false;
        if (vm.isEventRegistrationPayment) {
          $state.go('receipts.view', {
            receiptId: res._id,
            successMessage: 'Recibo creado. El pago se ha ralizado.'
          });
        } else {
          $state.go('receipts.list');
        }
      }

      function errorCallback(res) {
        $rootScope.showLoadingSpinner = false;
        vm.error = res.data.message;
      }
    }

    // Save Receipt
    function save(isValid) {
      $rootScope.showLoadingSpinner = true;
      if (!isValid) {
        $rootScope.showLoadingSpinner = false;
        $scope.$broadcast('show-errors-check-validity', 'vm.form.receiptForm');
        return false;
      }

      saveEventRegistration();
    }

    vm.print = function(id) {
      var data = document.getElementById(id).innerHTML;
      var mywindow = window.open('', 'my div', 'height=600,width=600');
      mywindow.document.write('<html><head><title>Imprimir Recibo</title>');
      mywindow.document.write('</head><body >');
      mywindow.document.write(data);
      mywindow.document.write('</body></html>');

      mywindow.document.close(); // necessary for IE >= 10
      mywindow.focus(); // necessary for IE >= 10

      mywindow.print();
      mywindow.close();

      // return true;
      //window.print();
    };

    vm.initReceipt();
  }
})();