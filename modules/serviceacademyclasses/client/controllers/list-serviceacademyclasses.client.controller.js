(function () {
  'use strict';

  angular
    .module('serviceacademyclasses')
    .controller('ServiceacademyclassesListController', ServiceacademyclassesListController);

  ServiceacademyclassesListController.$inject = ['ServiceacademyclassesService'];

  function ServiceacademyclassesListController(ServiceacademyclassesService) {
    var vm = this;

    vm.serviceacademyclasses = ServiceacademyclassesService.query();
  }
})();
