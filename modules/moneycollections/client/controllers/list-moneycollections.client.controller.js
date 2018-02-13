(function() {
  'use strict';

  angular
    .module('moneycollections')
    .controller('MoneycollectionsListController', MoneycollectionsListController);

  MoneycollectionsListController.$inject = ['$rootScope', '$scope', 'CurrentMoneycollectionsService', 'CurrentEventsService', 'Authentication',
    'ReceiptsByEventRegistrationService', '$anchorScroll', 'NgTableParams', '$filter', 'moment', 'EventpeoplegroupsService',
    'PersontypesService', 'MoneycollectionsService', 'Notification'
  ];

  function MoneycollectionsListController($rootScope, $scope, CurrentMoneycollectionsService, CurrentEventsService, Authentication,
    ReceiptsByEventRegistrationService, $anchorScroll, NgTableParams, $filter, moment, EventpeoplegroupsService,
    PersontypesService, MoneycollectionsService, Notification) {
    var vm = this;
    vm.moment = moment;
    vm.authentication = Authentication;
    vm.moneycollections = MoneycollectionsService.query();

    vm.getTotalClass = function(value) {
      if (value >= 0) {
        return 'success';
      } else {
        return 'danger';
      }
    };


    vm.getStatusClass = function(eventRegistration) {
      var hasPendingPayment = vm.hasPendingPayment(eventRegistration);
      if (hasPendingPayment && eventRegistration.status !== 'Entregado') {
        return 'warning';
      } else if (hasPendingPayment && eventRegistration.status === 'Entregado') {
        return 'danger';
      } else if (eventRegistration.status === 'Entregado') {
        return 'info';
      } else {
        return 'success';
      }
    };  

    // Remove existing Moneycollection
    function remove(eventRegistration) {
      if (confirm('Está seguro que desea eliminar la inscripción # ' + eventRegistration.registrationNumber + '?')) {
        vm.receiptsByEventRegistrationService.query({
          'eventRegistrationId': eventRegistration._id
        }, function(data) {
          if (data.length === 0) {
            MoneycollectionsService.delete({
              'moneycollectionId': eventRegistration._id
            }, function() {
              vm.warning = 'Se eliminó la inscripción #' + eventRegistration.registrationNumber + '. ' +
                'Sin embargo, la persona ha sido creada en la base de datos. ' +
                'Si desea inscribir la misma persona, debe hacerlo por medio de la opción Miembro Existente. ' +
                'Si desea eliminar la persona de la base de datos, debe hacerlo desde el modulo de Personas.';
              _.remove(vm.moneycollections, {
                _id: eventRegistration._id
              });
              vm.tableParams.reload();
              $anchorScroll(document.body.scrollTop);
              Notification.warning({
                title: 'Operación ejecutada exitosamente!',
                message: vm.warning,
                delay: 15000
              });
            });
          } else {
            vm.error = 'No se puede eliminar la inscripción #' + eventRegistration.registrationNumber + ' debido a que tiene recibos relacionados';
            Notification.error({
              title: 'Error al eliminar inscripción!',
              message: vm.error,
              delay: 10000
            });
          }
        });
      }
    }


    function resetRow(row, rowForm) {
      row.isEditing = false;
      rowForm.$setPristine();
      //vm.tableTracker.untrack(row);
      return _.find(vm.originalData, function(r) {
        return r._id === row._id;
      });
    }
  }
})();