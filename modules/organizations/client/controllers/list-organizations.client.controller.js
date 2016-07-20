(function () {
  'use strict';

  angular
    .module('organizations')
    .controller('OrganizationsListController', OrganizationsListController);

  OrganizationsListController.$inject = ['OrganizationsService'];

  function OrganizationsListController(OrganizationsService) {
    var vm = this;

    vm.organizations = OrganizationsService.query();
  }
})();
