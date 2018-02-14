(function () {
  'use strict';

  angular
    .module('moneycollections')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('moneycollections', {
        abstract: true,
        url: '/moneycollections',
        template: '<ui-view/>'
      })
      .state('moneycollections.report', {
        url: '/moneycollections/report',
        templateUrl: 'modules/moneycollections/client/views/report-moneycollections.client.view.html',
        controller: 'MoneycollectionsReportController',
        controllerAs: 'vm',
        data: {
          roles: ['boardDirector', 'boardReviewer'],
          pageTitle: 'Flujos de dinero - Reporte General'
        }
      })
      .state('moneycollections.list', {
        url: '',
        templateUrl: 'modules/moneycollections/client/views/list-moneycollections.client.view.html',
        controller: 'MoneycollectionsListController',
        controllerAs: 'vm',
        data: {
          roles: ['boardDirector', 'boardReviewer'],
          pageTitle: 'Lista de Flujos de dinero'
        }
      })
      .state('moneycollections.create', {
        url: '/create',
        templateUrl: 'modules/moneycollections/client/views/form-moneycollection.client.view.html',
        controller: 'MoneycollectionsController',
        controllerAs: 'vm',
        resolve: {
          moneycollectionResolve: newMoneycollection
        },
        data: {
          roles: ['boardDirector'],
          pageTitle: 'Crear Flujos de dinero'
        }
      })
      .state('moneycollections.edit', {
        url: '/:moneycollectionId/edit',
        templateUrl: 'modules/moneycollections/client/views/form-moneycollection.client.view.html',
        controller: 'MoneycollectionsController',
        controllerAs: 'vm',
        resolve: {
          moneycollectionResolve: getMoneycollection
        },
        data: {
          roles: ['boardDirector'],
          pageTitle: 'Editar Flujos de dinero - {{ moneycollectionResolve.name }}'
        }
      })
      .state('moneycollections.view', {
        url: '/:moneycollectionId',
        templateUrl: 'modules/moneycollections/client/views/view-moneycollection.client.view.html',
        controller: 'MoneycollectionsController',
        controllerAs: 'vm',
        resolve: {
          moneycollectionResolve: getMoneycollection
        },
        data: {
          roles: ['boardDirector', 'boardReviewer'],
          pageTitle: 'Flujos de dinero - {{ moneycollectionResolve.name }}'
        }
      });
  }

  getMoneycollection.$inject = ['$stateParams', 'MoneycollectionsService'];

  function getMoneycollection($stateParams, MoneycollectionsService) {
    return MoneycollectionsService.get({
      moneycollectionId: $stateParams.moneycollectionId
    }).$promise;
  }

  newMoneycollection.$inject = ['MoneycollectionsService'];

  function newMoneycollection(MoneycollectionsService) {
    return new MoneycollectionsService();
  }

  getPerson.$inject = ['$stateParams', 'PeopleService'];

  function getPerson($stateParams, PeopleService) {
    if ($stateParams.personId) {
      return PeopleService.get({
        personId: $stateParams.personId
      }).$promise;
    }
  }
})();