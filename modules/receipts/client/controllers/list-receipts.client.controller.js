(function () {
  'use strict';

  angular
    .module('receipts')
    .controller('ReceiptsListController', ReceiptsListController);

  ReceiptsListController.$inject = ['$rootScope', '$scope', 'ReceiptsService', 'CurrentReceiptsService', '$state', 'CurrentEventsService', 'EventregistrationsService',
    'Authentication', '$anchorScroll', 'NgTableParams', 'moment', 'Notification'
  ];

  function ReceiptsListController($rootScope, $scope, ReceiptsService, CurrentReceiptsService, $state, CurrentEventsService, EventregistrationsService,
    Authentication, $anchorScroll, NgTableParams, moment, Notification) {
    var vm = this;
    vm.moment = moment;
    vm.authentication = Authentication;

    vm.eventsFilterArray = [];
    vm.events = CurrentEventsService.query(function (data) {
      _.each(data, function (event) {
        vm.eventsFilterArray.push({
          id: event.name,
          title: event.name
        });
      });
    });

    $rootScope.showLoadingSpinner = true;
    vm.receipts = CurrentReceiptsService.query(function (data) {
      if (data.length && data.length > 0) {
        vm.lastIndex = data.length - 1;
      } else {
        vm.lastIndex = 0;
        $rootScope.showLoadingSpinner = false;
      }
      _.each(data, function (receipt, index) {
        receipt.paymentDate = vm.moment(receipt.paymentDate).format('YYYY-MM-DD');
        if (index === vm.lastIndex) {
          $rootScope.showLoadingSpinner = false;
        }
      });
    }, function () {
      $rootScope.showLoadingSpinner = false;
    });

    $scope.$watch('vm.paymentDate', function (newVal, oldVal) {
      if (newVal) {
        vm.dateFilterValue = vm.moment(vm.paymentDate).format('YYYY-MM-DD');
      } else {
        vm.dateFilterValue = '';
      }
      vm.tableParams.filter().paymentDate = vm.dateFilterValue;
    });

    vm.setEvent = setEvent;

    vm.isCollapsed = true;

    vm.tableParams = new NgTableParams({
      page: 1,
      count: 10
    }, {
        dataset: vm.receipts
      });

    //set receipt event
    function setEvent(event) {
      vm.event = event;
    }

    vm.getTotalClass = function (value) {
      if (value >= 0) {
        return 'success';
      } else {
        return 'danger';
      }
    };

    vm.getStatusClass = function (receipt) {
      if (receipt.paymentAmount >= 0) {
        return 'success';
      } else {
        return 'danger';
      }
    };

    // Remove existing Receipt
    vm.remove = function (receipt) {
      if (confirm('Está seguro que desea eliminar el recibo # ' + receipt.receiptNumber + ' ?')) {
        var eventRegistrationSuccessMsg = '';

        ReceiptsService.delete({
          'receiptId': receipt._id
        }, function () {
          if (vm.isEventRegistrationReceipt(receipt)) {
            eventRegistrationSuccessMsg = 'Y se actualizó el saldo de la inscripción # ' + receipt.eventRegistration.registrationNumber;
          }
          vm.success = 'El recibo # ' + receipt.receiptNumber + '  ha sido eliminado. ' + eventRegistrationSuccessMsg + '.';
          _.remove(vm.receipts, {
            _id: receipt._id
          });
          vm.tableParams.reload();
          Notification.info({
            title: 'Operación ejecutada exitosamente!',
            message: vm.success,
            delay: 15000
          });
        });
      }
    };

    vm.isEventRegistrationReceipt = function (receipt) {
      return receipt.eventRegistration !== undefined;
    };
  }
})();