(function () {
  'use strict';

  angular
    .module('')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('', {
        abstract: true,
        url: '/',
        template: '<ui-view/>'
      })
      .state('.list', {
        url: '',
        templateUrl: 'modules//client/views/list-.client.view.html',
        controller: 'ListController',
        controllerAs: 'vm',
        data: {
          pageTitle: ' List'
        }
      })
      .state('.create', {
        url: '/create',
        templateUrl: 'modules//client/views/form-.client.view.html',
        controller: 'Controller',
        controllerAs: 'vm',
        resolve: {
          Resolve: new
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : ' Create'
        }
      })
      .state('.edit', {
        url: '/:Id/edit',
        templateUrl: 'modules//client/views/form-.client.view.html',
        controller: 'Controller',
        controllerAs: 'vm',
        resolve: {
          Resolve: get
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit  {{ Resolve.name }}'
        }
      })
      .state('.view', {
        url: '/:Id',
        templateUrl: 'modules//client/views/view-.client.view.html',
        controller: 'Controller',
        controllerAs: 'vm',
        resolve: {
          Resolve: get
        },
        data:{
          pageTitle: ' {{ articleResolve.name }}'
        }
      });
  }

  get.$inject = ['$stateParams', 'Service'];

  function get($stateParams, Service) {
    return Service.get({
      Id: $stateParams.Id
    }).$promise;
  }

  new.$inject = ['Service'];

  function new(Service) {
    return new Service();
  }
})();
