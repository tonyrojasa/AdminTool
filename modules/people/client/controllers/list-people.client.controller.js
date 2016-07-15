(function() {
  'use strict';

  angular
    .module('people')
    .controller('PeopleListController', PeopleListController);

  PeopleListController.$inject = ['PeopleService'];

  function PeopleListController(PeopleService) {
    var vm = this;
    vm.people = PeopleService.query();
  }
})();