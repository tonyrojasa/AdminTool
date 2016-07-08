(function() {
  'use strict';

  angular
    .module('receipts')
    .controller('ReceiptsListController', ReceiptsListController);

  ReceiptsListController.$inject = ['ReceiptsService'];

  function ReceiptsListController(ReceiptsService) {
    var vm = this;

    vm.receipts = ReceiptsService.query();

    vm.hasPendingPayment = function(receipt) {
      return receipt.balanceDue > 0;
    };

    vm.getStatusClass = function(receipt) {
      return vm.hasPendingPayment(receipt) ? 'warning' : 'success';
    };
  }
})();