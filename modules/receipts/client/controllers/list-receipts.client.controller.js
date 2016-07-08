(function () {
  'use strict';

  angular
    .module('receipts')
    .controller('ReceiptsListController', ReceiptsListController);

  ReceiptsListController.$inject = ['ReceiptsService'];

  function ReceiptsListController(ReceiptsService) {
    var vm = this;

    vm.receipts = ReceiptsService.query();
  }
})();
