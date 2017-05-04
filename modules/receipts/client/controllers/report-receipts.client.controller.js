(function() {
  'use strict';

  angular
    .module('eventregistrations')
    .controller('ReceiptsReportController', ReceiptsReportController);

  ReceiptsReportController.$inject = ['$rootScope', '$scope', 'ReceiptsByEventService', '$state', 'EventsService', 'EventregistrationsService',
    'Authentication', 'EventpeoplegroupsService', 'PersontypesService', 'moment'
  ];

  function ReceiptsReportController($rootScope, $scope, ReceiptsByEventService, $state, EventsService, EventregistrationsService,
    Authentication, EventpeoplegroupsService, PersontypesService, moment) {
    var vm = this;
    vm.moment = moment;
    vm.authentication = Authentication;
    init();

    $scope.$watch('vm.paymentDate', function(newVal, oldVal) {
      if (newVal) {
        vm.dateFilterValue = vm.moment(vm.paymentDate).format('YYYY-MM-DD');
      } else {
        vm.dateFilterValue = '';
      }
    });

    function init() {
      vm.events = EventsService.query();
      vm.eventPeopleGroups = EventpeoplegroupsService.query();
      vm.personTypes = PersontypesService.query();
    }

    // $scope.$watch('vm.receipts', function(newVal, oldVal) {
    //   debugger;
    //   if (newVal) {
    //     $rootScope.showLoadingSpinner = false;
    //   }
    // });

    vm.setEvent = function(event) {
      $rootScope.showLoadingSpinner = true;
      vm.receipts = ReceiptsByEventService.query({
        'eventId': event._id
      }, function(data) {
        if (data.length && data.length > 0) {
          vm.lastIndex = data.length - 1;
        } else {
          vm.lastIndex = 0;
          $rootScope.showLoadingSpinner = false;
        }
        _.each(data, function(receipt, index) {
          receipt.paymentDate = vm.moment(receipt.paymentDate).format('YYYY-MM-DD');
          if (index === vm.lastIndex) {
            $rootScope.showLoadingSpinner = false;
          }
        });
      }, function() {
        $rootScope.showLoadingSpinner = false;
      });
    };

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

    vm.orderByMe = function(x) {
      vm.myOrderBy = x;
    };

  }
})();