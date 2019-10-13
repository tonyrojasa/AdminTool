(function() {
  'use strict';

  angular
    .module('eventregistrationrequests')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('eventregistrationrequests', {
        abstract: true,
        url: '/eventregistrationrequests',
        template: '<ui-view/>'
      })
      .state('eventregistrationrequests.report', {
        url: '/eventregistrationrequests/report',
        templateUrl: 'modules/eventregistrationrequests/client/views/report-eventregistrationrequests.client.view.html',
        controller: 'eventregistrationrequestsReportController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'inscriptor', 'user'],
          pageTitle: 'Inscripciones - Reporte General'
        }
      })
      .state('eventregistrationrequests.list', {
        url: '',
        templateUrl: 'modules/eventregistrationrequests/client/views/list-eventregistrationrequests.client.view.html',
        controller: 'EventregistrationrequestsListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'inscriptor', 'user'],
          pageTitle: 'Lista de Inscripciones'
        }
      })
      .state('eventregistrationrequests.create', {
        url: '/create',
        templateUrl: 'modules/eventregistrationrequests/client/views/form-eventregistrationrequest.client.view.html',
        controller: 'EventregistrationrequestsController',
        controllerAs: 'vm',
        resolve: {
          eventregistrationrequestResolve: newEventregistrationrequest
        },
        data: {
          roles: ['admin', 'inscriptor'],
          pageTitle: 'Crear Sulicitud Inscripcion'
        }
      })
      .state('eventregistrationrequests.edit', {
        url: '/:eventregistrationrequestId/edit/:newMember',
        params: {
          'newMember': 'true',
          'personId': null
        },
        templateUrl: 'modules/eventregistrationrequests/client/views/form-eventregistrationrequet.client.view.html',
        controller: 'EventregistrationrequestsController',
        controllerAs: 'vm',
        resolve: {
          eventregistrationrequestResolve: getEventregistrationrequest,
          personResolve: getPerson
        },
        data: {
          roles: ['admin', 'inscriptor'],
          pageTitle: 'Editar Inscripcion - {{ eventregistrationrequestResolve.name }}'
        }
      })
      .state('eventregistrationrequests.view', {
        url: '/:eventregistrationrequestId',
        templateUrl: 'modules/eventregistrationrequests/client/views/view-eventregistrationrequet.client.view.html',
        controller: 'EventregistrationrequestsController',
        controllerAs: 'vm',
        resolve: {
          eventregistrationrequestResolve: getEventregistrationrequest,
          personResolve: newPerson
        },
        data: {
          roles: ['admin', 'inscriptor'],
          pageTitle: 'Inscripcion - {{ articleResolve.name }}'
        }
      });
  }

  getEventregistrationrequest.$inject = ['$stateParams', 'EventregistrationrequestsService'];

  function getEventregistrationrequest($stateParams, EventregistrationrequestsService) {
    return EventregistrationrequestsService.get({
      eventregistrationrequestId: $stateParams.eventregistrationrequestId
    }).$promise;
  }

  newEventregistrationrequest.$inject = ['EventregistrationrequestsService'];

  function newEventregistrationrequest(EventregistrationrequestsService) {
    return new EventregistrationrequestsService();
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