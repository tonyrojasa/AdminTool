(function() {
  'use strict';

  angular
    .module('receipts')
    .controller('ReceiptsListController', ReceiptsListController);

  ReceiptsListController.$inject = ['$scope', 'ReceiptsService', '$state', 'EventsService', 'EventregistrationsService',
    'Authentication', '$anchorScroll', 'NgTableParams', 'moment'
  ];

  function ReceiptsListController($scope, ReceiptsService, $state, EventsService, EventregistrationsService,
    Authentication, $anchorScroll, NgTableParams, moment) {
    var vm = this;
    vm.moment = moment;
    vm.authentication = Authentication;

    vm.eventsFilterArray = [];
    vm.events = EventsService.query(function(data) {
      _.each(data, function(event) {
        vm.eventsFilterArray.push({
          id: event.name,
          title: event.name
        });
      });
    });
    vm.receipts = ReceiptsService.query();

    vm.receipts = ReceiptsService.query(function(data) {
      _.each(data, function(receipt) {
        receipt.paymentDate = vm.moment(receipt.paymentDate).format('YYYY-MM-DD');
      });
    });

    $scope.$watch('vm.paymentDate', function(newVal, oldVal) {
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

    vm.getTotalClass = function(value) {
      if (value >= 0) {
        return 'success';
      } else {
        return 'danger';
      }
    };

    vm.getStatusClass = function(receipt) {
      if (receipt.paymentAmount >= 0) {
        return 'success';
      } else {
        return 'danger';
      }
    };
    // Remove existing Receipt
    vm.remove = function(receipt) {
      if (confirm('Está seguro que desea eliminar el recibo # ' + receipt.receiptNumber + ' ?')) {
        var eventRegistrationSuccessMsg = '';
        receipt.$remove(function() {
          if (vm.isEventRegistrationReceipt(receipt)) {
            vm.updateEventRegistration(receipt);
            eventRegistrationSuccessMsg = 'Y se actualizó el saldo de la inscripción # ' + receipt.eventRegistration.registrationNumber;
          }
          vm.success = 'Se eliminó el recibo #' + receipt.receiptNumber + '. ' + eventRegistrationSuccessMsg;
          _.remove(vm.receipts, {
            _id: receipt._id
          });
          vm.tableParams.reload();
          $anchorScroll(document.body.scrollTop);
        });
      }
    };

    vm.updateEventRegistration = function(receipt) {
      receipt.eventRegistration.balanceAmount += receipt.paymentAmount;
      EventregistrationsService.update({
        eventregistrationId: receipt.eventRegistration._id
      }, receipt.eventRegistration);
    };

    vm.isEventRegistrationReceipt = function(receipt) {
      return receipt.eventRegistration !== undefined;
    };
  }
})();