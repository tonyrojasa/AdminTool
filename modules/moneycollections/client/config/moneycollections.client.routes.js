(function() {
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
          roles: ['admin', 'inscriptor', 'user'],
          pageTitle: 'Inscripciones - Reporte General'
        }
      })
      .state('moneycollections.list', {
        url: '',
        templateUrl: 'modules/moneycollections/client/views/list-moneycollections.client.view.html',
        controller: 'MoneycollectionsListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'inscriptor', 'user'],
          pageTitle: 'Lista de Inscripciones'
        }
      })
      .state('moneycollections.create', {
        url: '/create/:newMember',
        params: {
          newMember: 'true'
        },
        templateUrl: 'modules/moneycollections/client/views/form-moneycollection.client.view.html',
        controller: 'MoneycollectionsController',
        controllerAs: 'vm',
        resolve: {
          moneycollectionResolve: newMoneycollection,
          personResolve: newPerson
        },
        data: {
          roles: ['admin', 'inscriptor'],
          pageTitle: 'Crear Inscripcion'
        }
      })
      .state('moneycollections.edit', {
        url: '/:moneycollectionId/edit/:newMember',
        params: {
          'newMember': 'true',
          'personId': null
        },
        templateUrl: 'modules/moneycollections/client/views/form-moneycollection.client.view.html',
        controller: 'MoneycollectionsController',
        controllerAs: 'vm',
        resolve: {
          moneycollectionResolve: getMoneycollection,
          personResolve: getPerson
        },
        data: {
          roles: ['admin', 'inscriptor'],
          pageTitle: 'Editar Inscripcion - {{ moneycollectionResolve.name }}'
        }
      })
      .state('moneycollections.view', {
        url: '/:moneycollectionId',
        templateUrl: 'modules/moneycollections/client/views/view-moneycollection.client.view.html',
        controller: 'MoneycollectionsController',
        controllerAs: 'vm',
        resolve: {
          moneycollectionResolve: getMoneycollection,
          personResolve: newPerson
        },
        data: {
          roles: ['admin', 'inscriptor'],
          pageTitle: 'Inscripcion - {{ articleResolve.name }}'
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

  newPerson.$inject = ['PeopleService'];

  function newPerson(PeopleService) {
    return new PeopleService();
  }

})();