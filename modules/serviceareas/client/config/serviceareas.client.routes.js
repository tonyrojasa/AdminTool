(function() {
  'use strict';

  angular
    .module('serviceareas')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('serviceareas', {
        abstract: true,
        url: '/serviceareas',
        template: '<ui-view/>'
      })
      .state('serviceareas.list', {
        url: '',
        templateUrl: 'modules/serviceareas/client/views/list-serviceareas.client.view.html',
        controller: 'ServiceareasListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'inscriptor', 'teacher', 'user'],
          pageTitle: 'Lista de Áreas de Servicio'
        }
      })
      .state('serviceareas.create', {
        url: '/create',
        templateUrl: 'modules/serviceareas/client/views/form-servicearea.client.view.html',
        controller: 'ServiceareasController',
        controllerAs: 'vm',
        resolve: {
          serviceareaResolve: newServicearea
        },
        data: {
          roles: ['admin', 'inscriptor', 'teacher'],
          pageTitle: 'Crear Área de Servicio'
        }
      })
      .state('serviceareas.edit', {
        url: '/:serviceareaId/edit',
        templateUrl: 'modules/serviceareas/client/views/form-servicearea.client.view.html',
        controller: 'ServiceareasController',
        controllerAs: 'vm',
        resolve: {
          serviceareaResolve: getServicearea
        },
        data: {
          roles: ['admin', 'inscriptor', 'teacher'],
          pageTitle: 'Editar Área de Servicio {{ serviceareaResolve.name }}'
        }
      })
      .state('serviceareas.view', {
        url: '/:serviceareaId',
        templateUrl: 'modules/serviceareas/client/views/view-servicearea.client.view.html',
        controller: 'ServiceareasController',
        controllerAs: 'vm',
        resolve: {
          serviceareaResolve: getServicearea
        },
        data: {
          roles: ['admin', 'inscriptor', 'teacher'],
          pageTitle: 'Área de Servicio {{ articleResolve.name }}'
        }
      });
  }

  getServicearea.$inject = ['$stateParams', 'ServiceareasService'];

  function getServicearea($stateParams, ServiceareasService) {
    return ServiceareasService.get({
      serviceareaId: $stateParams.serviceareaId
    }).$promise;
  }

  newServicearea.$inject = ['ServiceareasService'];

  function newServicearea(ServiceareasService) {
    return new ServiceareasService();
  }
})();