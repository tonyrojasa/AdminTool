(function() {
  'use strict';

  angular
    .module('persontypes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('persontypes', {
        abstract: true,
        url: '/persontypes',
        template: '<ui-view/>'
      })
      .state('persontypes.list', {
        url: '',
        templateUrl: 'modules/persontypes/client/views/list-persontypes.client.view.html',
        controller: 'PersontypesListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'inscriptor', 'teacher', 'user'],
          pageTitle: 'Lista Tipos de Persona'
        }
      })
      .state('persontypes.create', {
        url: '/create',
        templateUrl: 'modules/persontypes/client/views/form-persontype.client.view.html',
        controller: 'PersontypesController',
        controllerAs: 'vm',
        resolve: {
          persontypeResolve: newPersontype
        },
        data: {
          roles: ['admin', 'inscriptor', 'teacher'],
          pageTitle: 'Create Tipo de Persona'
        }
      })
      .state('persontypes.edit', {
        url: '/:persontypeId/edit',
        templateUrl: 'modules/persontypes/client/views/form-persontype.client.view.html',
        controller: 'PersontypesController',
        controllerAs: 'vm',
        resolve: {
          persontypeResolve: getPersontype
        },
        data: {
          roles: ['admin', 'inscriptor', 'teacher'],
          pageTitle: 'Editar Tipo de Persona - {{ persontypeResolve.name }}'
        }
      })
      .state('persontypes.view', {
        url: '/:persontypeId',
        templateUrl: 'modules/persontypes/client/views/view-persontype.client.view.html',
        controller: 'PersontypesController',
        controllerAs: 'vm',
        resolve: {
          persontypeResolve: getPersontype
        },
        data: {
          roles: ['admin', 'inscriptor', 'teacher'],
          pageTitle: 'Tipos de Persona {{ articleResolve.name }}'
        }
      });
  }

  getPersontype.$inject = ['$stateParams', 'PersontypesService'];

  function getPersontype($stateParams, PersontypesService) {
    return PersontypesService.get({
      persontypeId: $stateParams.persontypeId
    }).$promise;
  }

  newPersontype.$inject = ['PersontypesService'];

  function newPersontype(PersontypesService) {
    return new PersontypesService();
  }
})();