(function() {
  'use strict';

  angular
    .module('receipts')
    .controller('ReceiptsListController', ReceiptsListController);

  ReceiptsListController.$inject = ['ReceiptsService', '$state'];

  function ReceiptsListController(ReceiptsService, $state) {
    var vm = this;

    vm.receipts = ReceiptsService.query();

    vm.getStatusClass = function(receipt) {
      if (receipt.balanceDue === 0) {
        return 'success';
      } else if (receipt.balanceDue > 0) {
        return 'warning';
      } else {
        return 'danger';
      }
    };
    // Remove existing Receipt
    vm.remove = function(receipt) {
      if (confirm('Are you sure you want to delete?')) {
        receipt.$remove();
      }
    };
  }
})();