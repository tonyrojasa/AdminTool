(function() {
  'use strict';

  angular
    .module('receipts')
    .controller('ReceiptsListController', ReceiptsListController);

  ReceiptsListController.$inject = ['ReceiptsService', '$state'];

  function ReceiptsListController(ReceiptsService, $state) {
    var vm = this;

    vm.receipts = ReceiptsService.query();

    vm.hasPendingPayment = function(receipt) {
      return receipt.balanceDue > 0;
    };

    vm.getStatusClass = function(receipt) {
      return vm.hasPendingPayment(receipt) ? 'warning' : 'success';
    };
    // Remove existing Receipt
    vm.remove = function(receipt) {
      debugger;
      if (confirm('Are you sure you want to delete?')) {
        receipt.$remove();
      }
    };
  }
})();