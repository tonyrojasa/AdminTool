(function() {
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
          roles: ['admin', 'inscriptor'],
          pageTitle: 'Eventregistrations List'
        }
      })
      .state('eventregistrations.create', {
        url: '/create/:newMember',
        params: {
          newMember: 'true'
        },
        templateUrl: 'modules/eventregistrations/client/views/form-eventregistration.client.view.html',
        controller: 'EventregistrationsController',
        controllerAs: 'vm',
        resolve: {
          eventregistrationResolve: newEventregistration,
          personResolve: newPerson
        },
        data: {
          roles: ['admin', 'inscriptor'],
          pageTitle: 'Eventregistrations Create'
        }
      })
      .state('eventregistrations.edit', {
        url: '/:eventregistrationId/edit:newMember',
        params: {
          'newMember': 'true',
          'personId': null
        },
        templateUrl: 'modules/eventregistrations/client/views/form-eventregistration.client.view.html',
        controller: 'EventregistrationsController',
        controllerAs: 'vm',
        resolve: {
          eventregistrationResolve: getEventregistration,
          personResolve: getPerson
        },
        data: {
          roles: ['admin', 'inscriptor'],
          pageTitle: 'Edit Eventregistration {{ eventregistrationResolve.name }}'
        }
      })
      .state('eventregistrations.view', {
        url: '/:eventregistrationId',
        templateUrl: 'modules/eventregistrations/client/views/view-eventregistration.client.view.html',
        controller: 'EventregistrationsController',
        controllerAs: 'vm',
        resolve: {
          eventregistrationResolve: getEventregistration,
          personResolve: newPerson
        },
        data: {
          roles: ['admin', 'inscriptor'],
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