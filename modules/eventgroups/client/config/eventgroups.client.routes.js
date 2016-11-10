(function() {
  'use strict';

  angular
    .module('eventgroups')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('eventgroups', {
        abstract: true,
        url: '/eventgroups',
        template: '<ui-view/>'
      })
      .state('eventgroups.list', {
        url: '',
        templateUrl: 'modules/eventgroups/client/views/list-eventgroups.client.view.html',
        controller: 'EventgroupsListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'inscriptor', 'user'],
          pageTitle: 'Lista de Cabañas'
        }
      })
      .state('eventgroups.create', {
        url: '/create',
        templateUrl: 'modules/eventgroups/client/views/form-eventgroup.client.view.html',
        controller: 'EventgroupsController',
        controllerAs: 'vm',
        resolve: {
          eventgroupResolve: newEventgroup
        },
        data: {
          roles: ['admin', 'inscriptor'],
          pageTitle: 'Crear Cabaña'
        }
      })
      .state('eventgroups.edit', {
        url: '/:eventgroupId/edit',
        templateUrl: 'modules/eventgroups/client/views/form-eventgroup.client.view.html',
        controller: 'EventgroupsController',
        controllerAs: 'vm',
        resolve: {
          eventgroupResolve: getEventgroup
        },
        data: {
          roles: ['admin', 'inscriptor'],
          pageTitle: 'Editar Cabaña - {{ eventgroupResolve.name }}'
        }
      })
      .state('eventgroups.view', {
        url: '/:eventgroupId',
        templateUrl: 'modules/eventgroups/client/views/view-eventgroup.client.view.html',
        controller: 'EventgroupsController',
        controllerAs: 'vm',
        resolve: {
          eventgroupResolve: getEventgroup
        },
        data: {
          roles: ['admin', 'inscriptor'],
          pageTitle: 'Cabaña - {{ articleResolve.name }}'
        }
      });
  }

  getEventgroup.$inject = ['$stateParams', 'EventgroupsService'];

  function getEventgroup($stateParams, EventgroupsService) {
    return EventgroupsService.get({
      eventgroupId: $stateParams.eventgroupId
    }).$promise;
  }

  newEventgroup.$inject = ['EventgroupsService'];

  function newEventgroup(EventgroupsService) {
    return new EventgroupsService();
  }
})();