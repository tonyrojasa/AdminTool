(function() {
  'use strict';

  // Receipts controller
  angular
    .module('receipts')
    .controller('ReceiptsController', ReceiptsController);

  ReceiptsController.$inject = ['$scope', '$state', 'Authentication', 'receiptResolve', 'EventsService',
    'eventregistrationResolve', 'EventregistrationsService', "$stateParams"
  ];

  function ReceiptsController($scope, $state, Authentication, receipt, EventsService, eventregistration,
    EventregistrationsService, $stateParams) {
    var vm = this;

    vm.successMessage = $stateParams.successMessage;

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
      vm.receipt.paymentAmount = '';
      vm.receipt.balanceDue = '';
    }

    function calculateBalanceDue() {
      if (vm.receipt.isDebit && vm.receipt.paymentAmount > 0) {
        vm.receipt.paymentAmount = -vm.receipt.paymentAmount;
      }

      vm.receipt.balanceDue = vm.receipt.currentBalance - vm.receipt.paymentAmount;
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
      //default to current user
      vm.receipt.receivedBy = vm.authentication.user.displayName;

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

    vm.setPaymentOf = function(paymentOf) {
      vm.receipt.paymentOf = paymentOf;
    };

    //set registration event
    vm.setEvent = function(event) {
      vm.receipt.event = event;
    };

    // Remove existing Receipt
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.receipt.$remove($state.go('receipts.list'));
      }
    }

    // Save EventRegistration (if null only save receipt)
    function saveEventRegistration() {
      if (vm.isEventRegistrationPayment) {
        vm.eventregistration.balanceAmount = vm.calculateBalanceDue();
        vm.eventregistration.$update(successCallback, errorCallback);
      } else {
        saveReceipt();
      }

      function successCallback(res) {
        vm.receipt.eventRegistration = res;
        saveReceipt();
      }

      function errorCallback(res) {
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
        if (vm.isEventRegistrationPayment) {
          $state.go('receipts.view', {
            receiptId: res._id,
            successMessage: 'El pago se ha ealizado exitosamente.'
          });
        } else {
          $state.go('receipts.list');
        }
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    // Save Receipt
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.receiptForm');
        return false;
      }
      if (vm.receipt.isDebit) {
        vm.receipt.balanceDue = -vm.receipt.paymentAmount;
      } else {
        vm.receipt.balanceDue = vm.receipt.currentBalance - vm.receipt.paymentAmount;
      }

      saveEventRegistration();
    }

    vm.print = function() {
      window.print();
    };

    vm.initReceipt();
  }
})();