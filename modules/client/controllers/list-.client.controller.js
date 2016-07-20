(function () {
  'use strict';

  angular
    .module('')
    .controller('ListController', ListController);

  ListController.$inject = ['Service'];

  function ListController(Service) {
    var vm = this;

    vm. = Service.query();
  }
})();
