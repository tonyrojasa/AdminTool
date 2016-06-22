(function () {
  'use strict';

  angular
    .module('eventregistrations')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('eventregistrations', {
        abstract: true,
        url: '/eventregistrations',
        template: '<ui-view/>'
      })
      .state('eventregistrations.list', {
        url: '',
        templateUrl: 'modules/eventregistrations/client/views/list-eventregistrations.client.view.html',
        controller: 'EventregistrationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Eventregistrations List'
        }
      })
      .state('eventregistrations.create', {
        url: '/create',
        templateUrl: 'modules/eventregistrations/client/views/form-eventregistration.client.view.html',
        controller: 'EventregistrationsController',
        controllerAs: 'vm',
        resolve: {
          eventregistrationResolve: newEventregistration
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Eventregistrations Create'
        }
      })
      .state('eventregistrations.edit', {
        url: '/:eventregistrationId/edit',
        templateUrl: 'modules/eventregistrations/client/views/form-eventregistration.client.view.html',
        controller: 'EventregistrationsController',
        controllerAs: 'vm',
        resolve: {
          eventregistrationResolve: getEventregistration
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Eventregistration {{ eventregistrationResolve.name }}'
        }
      })
      .state('eventregistrations.view', {
        url: '/:eventregistrationId',
        templateUrl: 'modules/eventregistrations/client/views/view-eventregistration.client.view.html',
        controller: 'EventregistrationsController',
        controllerAs: 'vm',
        resolve: {
          eventregistrationResolve: getEventregistration
        },
        data: {
          pageTitle: 'Eventregistration {{ articleResolve.name }}'
        }
      });
  }

  getEventregistration.$inject = ['$stateParams', 'EventregistrationsService'];

  function getEventregistration($stateParams, EventregistrationsService) {
    return EventregistrationsService.get({
      eventregistrationId: $stateParams.eventregistrationId
    }).$promise;
  }

  newEventregistration.$inject = ['EventregistrationsService'];

  function newEventregistration(EventregistrationsService) {
    return new EventregistrationsService();
  }
})();
