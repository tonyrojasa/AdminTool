(function () {
  'use strict';

  angular
    .module('serviceareas')
    .controller('ServiceareasListController', ServiceareasListController);

  ServiceareasListController.$inject = ['ServiceareasService'];

  function ServiceareasListController(ServiceareasService) {
    var vm = this;

    vm.serviceareas = ServiceareasService.query();
  }
})();
