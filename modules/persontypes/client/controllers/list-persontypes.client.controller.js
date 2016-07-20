(function () {
  'use strict';

  angular
    .module('persontypes')
    .controller('PersontypesListController', PersontypesListController);

  PersontypesListController.$inject = ['PersontypesService'];

  function PersontypesListController(PersontypesService) {
    var vm = this;

    vm.persontypes = PersontypesService.query();
  }
})();
