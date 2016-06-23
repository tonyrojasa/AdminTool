(function () {
  'use strict';

  angular
    .module('organizations')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('organizations', {
        abstract: true,
        url: '/organizations',
        template: '<ui-view/>'
      })
      .state('organizations.list', {
        url: '',
        templateUrl: 'modules/organizations/client/views/list-organizations.client.view.html',
        controller: 'OrganizationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Organizations List'
        }
      })
      .state('organizations.create', {
        url: '/create',
        templateUrl: 'modules/organizations/client/views/form-organization.client.view.html',
        controller: 'OrganizationsController',
        controllerAs: 'vm',
        resolve: {
          organizationResolve: newOrganization
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Organizations Create'
        }
      })
      .state('organizations.edit', {
        url: '/:organizationId/edit',
        templateUrl: 'modules/organizations/client/views/form-organization.client.view.html',
        controller: 'OrganizationsController',
        controllerAs: 'vm',
        resolve: {
          organizationResolve: getOrganization
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Organization {{ organizationResolve.name }}'
        }
      })
      .state('organizations.view', {
        url: '/:organizationId',
        templateUrl: 'modules/organizations/client/views/view-organization.client.view.html',
        controller: 'OrganizationsController',
        controllerAs: 'vm',
        resolve: {
          organizationResolve: getOrganization
        },
        data: {
          pageTitle: 'Organization {{ articleResolve.name }}'
        }
      });
  }

  getOrganization.$inject = ['$stateParams', 'OrganizationsService'];

  function getOrganization($stateParams, OrganizationsService) {
    return OrganizationsService.get({
      organizationId: $stateParams.organizationId
    }).$promise;
  }

  newOrganization.$inject = ['OrganizationsService'];

  function newOrganization(OrganizationsService) {
    return new OrganizationsService();
  }
})();
