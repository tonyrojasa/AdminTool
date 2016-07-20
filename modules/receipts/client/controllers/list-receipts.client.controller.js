(function() {
  'use strict';

  angular
    .module('receipts')
    .controller('ReceiptsListController', ReceiptsListController);

  ReceiptsListController.$inject = ['ReceiptsService', '$state', 'CurrentEventsService'];

  function ReceiptsListController(ReceiptsService, $state, CurrentEventsService) {
    var vm = this;
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
      if (confirm('Are you sure you want to delete?')) {
        receipt.$remove();
      }
    };
  }
})();