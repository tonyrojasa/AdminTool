(function() {
  'use strict';

  angular
    .module('serviceacademyclasses')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('serviceacademyclasses', {
        abstract: true,
        url: '/serviceacademyclasses',
        template: '<ui-view/>'
      })
      .state('serviceacademyclasses.list', {
        url: '',
        templateUrl: 'modules/serviceacademyclasses/client/views/list-serviceacademyclasses.client.view.html',
        controller: 'ServiceacademyclassesListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'teacher', 'student', 'user'],
          pageTitle: 'Lista de Academias'
        }
      })
      .state('serviceacademyclasses.create', {
        url: '/create',
        templateUrl: 'modules/serviceacademyclasses/client/views/form-serviceacademyclass.client.view.html',
        controller: 'ServiceacademyclassesController',
        controllerAs: 'vm',
        resolve: {
          serviceacademyclassResolve: newServiceacademyclass
        },
        data: {
          roles: ['admin', 'teacher'],
          pageTitle: 'Crear Academia'
        }
      })
      .state('serviceacademyclasses.edit', {
        url: '/:serviceacademyclassId/edit',
        templateUrl: 'modules/serviceacademyclasses/client/views/form-serviceacademyclass.client.view.html',
        controller: 'ServiceacademyclassesController',
        controllerAs: 'vm',
        resolve: {
          serviceacademyclassResolve: getServiceacademyclass
        },
        data: {
          roles: ['admin', 'teacher'],
          pageTitle: 'Editar Academia {{ serviceacademyclassResolve.name }}'
        }
      })
      .state('serviceacademyclasses.view', {
        url: '/:serviceacademyclassId',
        templateUrl: 'modules/serviceacademyclasses/client/views/view-serviceacademyclass.client.view.html',
        controller: 'ServiceacademyclassesController',
        controllerAs: 'vm',
        resolve: {
          serviceacademyclassResolve: getServiceacademyclass
        },
        data: {
          roles: ['admin', 'teacher', 'student'],
          pageTitle: 'Academia {{ articleResolve.name }}'
        }
      });
  }

  getServiceacademyclass.$inject = ['$stateParams', 'ServiceacademyclassesService'];

  function getServiceacademyclass($stateParams, ServiceacademyclassesService) {
    return ServiceacademyclassesService.get({
      serviceacademyclassId: $stateParams.serviceacademyclassId
    }).$promise;
  }

  newServiceacademyclass.$inject = ['ServiceacademyclassesService'];

  function newServiceacademyclass(ServiceacademyclassesService) {
    return new ServiceacademyclassesService();
  }
})();