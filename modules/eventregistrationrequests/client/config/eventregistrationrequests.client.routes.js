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
        url: '/solicitudes',
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
        url: '/inscripcion',
        templateUrl: 'modules/eventregistrationrequests/client/views/form-eventregistrationrequest.client.view.html',
        controller: 'EventregistrationrequestsController',
        controllerAs: 'vm',
        resolve: {
          eventregistrationrequestResolve: newEventregistrationrequest
        },
        data: {
          roles: ['admin', 'inscriptor', 'guest'],
          pageTitle: 'Crear Sulicitud Inscripcion'
        }
      })
      .state('eventregistrationrequests.edit', {
        url: '/:eventregistrationrequestId/edit',
        templateUrl: 'modules/eventregistrationrequests/client/views/form-eventregistrationrequest.client.view.html',
        controller: 'EventregistrationrequestsController',
        controllerAs: 'vm',
        resolve: {
          eventregistrationrequestResolve: getEventregistrationrequest
        },
        data: {
          roles: ['admin', 'inscriptor'],
          pageTitle: 'Editar Inscripcion - {{ eventregistrationrequestResolve.name }}'
        }
      })
      .state('eventregistrationrequests.view', {
        url: '/:eventregistrationrequestId',
        templateUrl: 'modules/eventregistrationrequests/client/views/view-eventregistrationrequest.client.view.html',
        controller: 'EventregistrationrequestsController',
        controllerAs: 'vm',
        resolve: {
          eventregistrationrequestResolve: getEventregistrationrequest
        },
        data: {
          roles: ['admin', 'inscriptor', 'guest'],
          pageTitle: 'Inscripcion - {{ articleResolve.name }}'
        }
      })
      .state('eventregistrationrequests.viewByRequestNumber', {
        url: '/inscripcion/:requestNumber',
        templateUrl: 'modules/eventregistrationrequests/client/views/view-eventregistrationrequest.client.view.html',
        controller: 'EventregistrationrequestsController',
        controllerAs: 'vm',
        resolve: {
          eventregistrationrequestResolve: getEventregistrationrequestByRequestNumber
        },
        data: {
          roles: ['admin', 'inscriptor', 'guest'],
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

  getEventregistrationrequestByRequestNumber.$inject = ['$stateParams', 'EventregistrationrequestsServiceByRequestNumber'];

  function getEventregistrationrequestByRequestNumber($stateParams, EventregistrationrequestsServiceByRequestNumber) {
    return EventregistrationrequestsServiceByRequestNumber.get({
      requestNumber: $stateParams.requestNumber
    }).$promise;
  }

  newEventregistrationrequest.$inject = ['EventregistrationrequestsService'];

  function newEventregistrationrequest(EventregistrationrequestsService) {
    return new EventregistrationrequestsService();
  }

  newEventregistration.$inject = ['EventregistrationsService'];

  function newEventregistration(EventregistrationsService) {
    return new EventregistrationsService();
  }

})();