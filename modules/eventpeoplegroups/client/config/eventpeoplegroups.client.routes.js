(function() {
  'use strict';

  angular
    .module('eventpeoplegroups')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('eventpeoplegroups', {
        abstract: true,
        url: '/eventpeoplegroups',
        template: '<ui-view/>'
      })
      .state('eventpeoplegroups.list', {
        url: '',
        templateUrl: 'modules/eventpeoplegroups/client/views/list-eventpeoplegroups.client.view.html',
        controller: 'EventpeoplegroupsListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'inscriptor', 'user'],
          pageTitle: 'Lista de Grupo de Personas'
        }
      })
      .state('eventpeoplegroups.create', {
        url: '/create',
        templateUrl: 'modules/eventpeoplegroups/client/views/form-eventpeoplegroup.client.view.html',
        controller: 'EventpeoplegroupsController',
        controllerAs: 'vm',
        resolve: {
          eventpeoplegroupResolve: newEventpeoplegroup
        },
        data: {
          roles: ['admin', 'inscriptor'],
          pageTitle: 'Crear Grupo de Personas'
        }
      })
      .state('eventpeoplegroups.edit', {
        url: '/:eventpeoplegroupId/edit',
        templateUrl: 'modules/eventpeoplegroups/client/views/form-eventpeoplegroup.client.view.html',
        controller: 'EventpeoplegroupsController',
        controllerAs: 'vm',
        resolve: {
          eventpeoplegroupResolve: getEventpeoplegroup
        },
        data: {
          roles: ['admin', 'inscriptor'],
          pageTitle: 'Editar Grupo de Personas - {{ eventpeoplegroupResolve.name }}'
        }
      })
      .state('eventpeoplegroups.view', {
        url: '/:eventpeoplegroupId',
        templateUrl: 'modules/eventpeoplegroups/client/views/view-eventpeoplegroup.client.view.html',
        controller: 'EventpeoplegroupsController',
        controllerAs: 'vm',
        resolve: {
          eventpeoplegroupResolve: getEventpeoplegroup
        },
        data: {
          roles: ['admin', 'inscriptor'],
          pageTitle: 'Grupo de Personas {{ articleResolve.name }}'
        }
      });
  }

  getEventpeoplegroup.$inject = ['$stateParams', 'EventpeoplegroupsService'];

  function getEventpeoplegroup($stateParams, EventpeoplegroupsService) {
    return EventpeoplegroupsService.get({
      eventpeoplegroupId: $stateParams.eventpeoplegroupId
    }).$promise;
  }

  newEventpeoplegroup.$inject = ['EventpeoplegroupsService'];

  function newEventpeoplegroup(EventpeoplegroupsService) {
    return new EventpeoplegroupsService();
  }
})();