(function() {
  'use strict';

  // Receipts controller
  angular
    .module('receipts')
    .controller('ReceiptsController', ReceiptsController);

  ReceiptsController.$inject = ['$scope', '$state', 'Authentication', 'receiptResolve', 'EventsService', 'eventregistrationResolve'];

  function ReceiptsController($scope, $state, Authentication, receipt, EventsService, eventregistration) {
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

      if (vm.eventregistration) {
        debugger;
        vm.isEventRegistrationPayment = true;
        vm.receipt.event = vm.eventregistration.event;
        vm.receipt.receivedFrom = vm.eventregistration.person.firstName + ' ' +
          vm.eventregistration.person.lastName + ' ' + vm.eventregistration.person.secondLastName;
        vm.receipt.currentBalance = vm.eventregistration.balanceAmount;
      }
    }
    vm.initReceipt();

    vm.setPaymentOf = function(paymentOf) {
      vm.receipt.paymentOf = paymentOf;
    };

    //set registration event
    vm.setEvent = function(event) {
      vm.receipt.event = event;
    }

    // Remove existing Receipt
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.receipt.$remove($state.go('receipts.list'));
      }
    }

    // Save Receipt
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.receiptForm');
        return false;
      }

      vm.receipt.balanceDue = vm.receipt.currentBalance - vm.receipt.paymentAmount;

      if (vm.receipt._id) {
        vm.receipt.$update(successCallback, errorCallback);
      } else {
        vm.receipt.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('receipts.view', {
          receiptId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();