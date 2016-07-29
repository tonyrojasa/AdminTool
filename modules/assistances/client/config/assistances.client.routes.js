(function() {
  'use strict';

  angular
    .module('assistances')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('assistances', {
        abstract: true,
        url: '/assistances',
        template: '<ui-view/>'
      })
      .state('assistances.list', {
        url: '',
        templateUrl: 'modules/assistances/client/views/list-assistances.client.view.html',
        controller: 'AssistancesListController',
        controllerAs: 'vm',
        resolve: {
          serviceacademyclassResolve: getServiceacademyclass
        },
        data: {
          roles: ['admin', 'teacher', 'student', 'user'],
          pageTitle: 'Lista de Asistencias'
        }
      })
      .state('assistances.create', {
        url: '/create',
        templateUrl: 'modules/assistances/client/views/form-assistance.client.view.html',
        controller: 'AssistancesController',
        controllerAs: 'vm',
        resolve: {
          assistanceResolve: newAssistance,
          serviceacademyclassResolve: getServiceacademyclass
        },
        data: {
          roles: ['admin', 'teacher'],
          pageTitle: 'Crear Lista de Asistencia'
        }
      })
      .state('assistances.edit', {
        url: '/:assistanceId/edit',
        templateUrl: 'modules/assistances/client/views/form-assistance.client.view.html',
        controller: 'AssistancesController',
        controllerAs: 'vm',
        resolve: {
          assistanceResolve: getAssistance,
          serviceacademyclassResolve: getServiceacademyclass
        },
        data: {
          roles: ['admin', 'teacher'],
          pageTitle: 'Editar Lista de Asistencia {{ assistanceResolve.name }}'
        }
      })
      .state('assistances.view', {
        url: '/:assistanceId',
        templateUrl: 'modules/assistances/client/views/view-assistance.client.view.html',
        controller: 'AssistancesController',
        controllerAs: 'vm',
        resolve: {
          assistanceResolve: getAssistance,
          serviceacademyclassResolve: getServiceacademyclass
        },
        data: {
          roles: ['admin', 'teacher', 'student'],
          pageTitle: 'Lista de Asistencia {{ articleResolve.name }}'
        }
      })
      .state('assistances.listServiceAcademyClassAssistance', {
        url: '/serviceacademyclasses/:serviceacademyclassId',
        templateUrl: 'modules/assistances/client/views/list-assistances.client.view.html',
        controller: 'AssistancesListController',
        controllerAs: 'vm',
        resolve: {
          assistanceResolve: getAssistance,
          serviceacademyclassResolve: getServiceacademyclass
        },
        data: {
          roles: ['admin', 'teacher', 'student'],
          pageTitle: 'Lista de Asistencia {{ articleResolve.name }}'
        }
      });
  }

  getAssistance.$inject = ['$stateParams', 'AssistancesService'];

  function getAssistance($stateParams, AssistancesService) {
    if ($stateParams.assistanceId) {
      return AssistancesService.get({
        assistanceId: $stateParams.assistanceId
      }).$promise;
    }
  }

  newAssistance.$inject = ['AssistancesService'];

  function newAssistance(AssistancesService) {
    return new AssistancesService();
  }

  getServiceacademyclass.$inject = ['$stateParams', 'ServiceacademyclassesService'];

  function getServiceacademyclass($stateParams, ServiceacademyclassesService) {
    if ($stateParams.serviceacademyclassId) {
      return ServiceacademyclassesService.get({
        serviceacademyclassId: $stateParams.serviceacademyclassId
      }).$promise;
    }
  }
})();