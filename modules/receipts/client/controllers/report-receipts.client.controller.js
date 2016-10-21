(function() {
  'use strict';

  angular
    .module('eventregistrations')
    .controller('ReceiptsReportController', ReceiptsReportController);

  ReceiptsReportController.$inject = ['$scope', 'ReceiptsService', '$state', 'EventsService', 'EventregistrationsService',
    'Authentication', 'EventpeoplegroupsService', 'PersontypesService', 'moment'
  ];

  function ReceiptsReportController($scope, ReceiptsService, $state, EventsService, EventregistrationsService,
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
      vm.receipts = ReceiptsService.query(function(data) {
        _.each(data, function(receipt) {
          receipt.paymentDate = vm.moment(receipt.paymentDate).format('YYYY-MM-DD');
        });
      });
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

    vm.orderByMe = function(x) {
      vm.myOrderBy = x;
    };

  }
})();