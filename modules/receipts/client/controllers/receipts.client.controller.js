(function() {
  'use strict';

  // Receipts controller
  angular
    .module('receipts')
    .controller('ReceiptsController', ReceiptsController);

  ReceiptsController.$inject = ['$scope', '$state', 'Authentication', 'receiptResolve', 'EventsService',
    'eventregistrationResolve', 'EventregistrationsService'
  ];

  function ReceiptsController($scope, $state, Authentication, receipt, EventsService, eventregistration,
    EventregistrationsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.receipt = receipt;
    vm.eventregistration = eventregistration;
    vm.error = null;
    vm.form = {};
    vm.events = EventsService.query();
    vm.remove = remove;
    vm.save = save;
    vm.initReceipt = initReceipt;

    function initReceipt() {
      vm.paymentOfList = [
        'Encuentro',
        'Academia',
        'Campamento',
        'Ofrenda',
        'Soda',
        'Otro'
      ];
      //default to current user
      vm.receipt.receivedBy = vm.authentication.user.displayName;
      if (vm.receipt._id) {
        vm.eventregistration = receipt.eventRegistration;
        EventregistrationsService.get({
          eventregistrationId: receipt.eventRegistration._id
        }, function(data) {
          vm.eventregistration = data;
        });
      }

      debugger;
      if (vm.eventregistration && !vm.receipt.eventRegistration) {
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
    }
    vm.initReceipt();

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
        vm.eventregistration.balanceAmount = vm.receipt.balanceDue;
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
          $state.go('eventregistrations.list');
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
      vm.receipt.balanceDue = vm.receipt.currentBalance - vm.receipt.paymentAmount;

      saveEventRegistration();
    }

    vm.print = function() {
      window.print();
    };
  }
})();