(function () {
  'use strict';

  angular
    .module('people')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('people', {
        abstract: true,
        url: '/people',
        template: '<ui-view/>'
      })
      .state('people.list', {
        url: '',
        templateUrl: 'modules/people/client/views/list-people.client.view.html',
        controller: 'PeopleListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'People List'
        }
      })
      .state('people.create', {
        url: '/create',
        templateUrl: 'modules/people/client/views/form-person.client.view.html',
        controller: 'PeopleController',
        controllerAs: 'vm',
        resolve: {
          personResolve: newPerson
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'People Create'
        }
      })
      .state('people.edit', {
        url: '/:personId/edit',
        templateUrl: 'modules/people/client/views/form-person.client.view.html',
        controller: 'PeopleController',
        controllerAs: 'vm',
        resolve: {
          personResolve: getPerson
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Person {{ personResolve.name }}'
        }
      })
      .state('people.view', {
        url: '/:personId',
        templateUrl: 'modules/people/client/views/view-person.client.view.html',
        controller: 'PeopleController',
        controllerAs: 'vm',
        resolve: {
          personResolve: getPerson
        },
        data: {
          pageTitle: 'Person {{ articleResolve.name }}'
        }
      });
  }

  getPerson.$inject = ['$stateParams', 'PeopleService'];

  function getPerson($stateParams, PeopleService) {
    return PeopleService.get({
      personId: $stateParams.personId
    }).$promise;
  }

  newPerson.$inject = ['PeopleService'];

  function newPerson(PeopleService) {
    return new PeopleService();
  }
})();
