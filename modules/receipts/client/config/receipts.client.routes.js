(function() {
  'use strict';

  angular
    .module('receipts')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('receipts', {
        abstract: true,
        url: '/receipts',
        template: '<ui-view/>'
      })
      .state('receipts.list', {
        url: '',
        templateUrl: 'modules/receipts/client/views/list-receipts.client.view.html',
        controller: 'ReceiptsListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'inscriptor', 'user', 'accountant'],
          pageTitle: 'Lista de Recibos'
        }
      })
      .state('receipts.report', {
        url: '/receipts/report',
        templateUrl: 'modules/receipts/client/views/report-receipts.client.view.html',
        controller: 'ReceiptsReportController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'inscriptor', 'user'],
          pageTitle: 'Recibos - Reporte General'
        }
      })
      .state('receipts.createFromEventRegistration', {
        url: '/create/:eventregistrationId',
        templateUrl: 'modules/receipts/client/views/form-receipt.client.view.html',
        controller: 'ReceiptsController',
        controllerAs: 'vm',
        resolve: {
          receiptResolve: newReceipt,
          eventregistrationResolve: getEventregistration
        },
        data: {
          roles: ['admin', 'inscriptor', 'accountant'],
          pageTitle: 'Crear Recibo para evento'
        }
      })
      .state('receipts.createForNonRegistrationEvents', {
        url: '/createForNonRegistrationEvents',
        templateUrl: 'modules/receipts/client/views/form-receipt.client.view.html',
        controller: 'ReceiptsController',
        controllerAs: 'vm',
        resolve: {
          receiptResolve: newReceipt,
          eventregistrationResolve: getEventregistration
        },
        data: {
          roles: ['admin', 'inscriptor', 'accountant'],
          pageTitle: 'Crear Recibo para evento sin inscripcion'
        }
      })
      .state('receipts.create', {
        url: '/create',
        templateUrl: 'modules/receipts/client/views/form-receipt.client.view.html',
        controller: 'ReceiptsController',
        controllerAs: 'vm',
        resolve: {
          receiptResolve: newReceipt,
          eventregistrationResolve: getEventregistration
        },
        data: {
          roles: ['admin', 'accountant'],
          pageTitle: 'Crear Recibo'
        }
      })
      .state('receipts.edit', {
        url: '/:receiptId/edit',
        templateUrl: 'modules/receipts/client/views/form-receipt.client.view.html',
        controller: 'ReceiptsController',
        controllerAs: 'vm',
        resolve: {
          receiptResolve: getReceipt,
          eventregistrationResolve: getEventregistration
        },
        data: {
          roles: ['admin', 'accountant'],
          pageTitle: 'Editar Recibo {{ receiptResolve.name }}'
        }
      })
      .state('receipts.view', {
        url: '/:receiptId',
        params: {
          successMessage: null
        },
        templateUrl: 'modules/receipts/client/views/view-receipt.client.view.html',
        controller: 'ReceiptsController',
        controllerAs: 'vm',
        resolve: {
          receiptResolve: getReceipt,
          eventregistrationResolve: getEventregistration
        },
        data: {
          roles: ['admin', 'inscriptor', 'guest', 'accountant'],
          pageTitle: 'Receipt {{ articleResolve.name }}'
        }
      });
  }

  getReceipt.$inject = ['$stateParams', 'ReceiptsService'];

  function getReceipt($stateParams, ReceiptsService) {
    return ReceiptsService.get({
      receiptId: $stateParams.receiptId
    }).$promise;
  }

  newReceipt.$inject = ['ReceiptsService'];

  function newReceipt(ReceiptsService) {
    return new ReceiptsService();
  }

  getEventregistration.$inject = ['$stateParams', 'EventregistrationsService'];

  function getEventregistration($stateParams, EventregistrationsService) {
    if ($stateParams.eventregistrationId) {
      return EventregistrationsService.get({
        eventregistrationId: $stateParams.eventregistrationId
      }).$promise;
    }
  }
})();