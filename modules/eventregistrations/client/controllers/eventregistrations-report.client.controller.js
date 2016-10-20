(function() {
  'use strict';

  angular
    .module('eventregistrations')
    .controller('EventregistrationsReportController', EventregistrationsReportController);

  EventregistrationsReportController.$inject = ['$scope', 'EventregistrationsService',
    'EventsService', 'EventpeoplegroupsService', 'PersontypesService', 'ReceiptsByEventRegistrationService', '$timeout', 'moment'
  ];

  function EventregistrationsReportController($scope, EventregistrationsService, EventsService,
    EventpeoplegroupsService, PersontypesService, ReceiptsByEventRegistrationService, $timeout, moment) {
    var vm = this;
    vm.moment = moment;
    vm.receiptsByEventRegistrationService = ReceiptsByEventRegistrationService;
    vm.events = EventsService.query();
    vm.eventPeopleGroups = EventpeoplegroupsService.query();
    vm.personTypes = PersontypesService.query();
    init();

    $scope.$watch('vm.registrationDate', function(newVal, oldVal) {
      if (newVal) {
        vm.dateFilterValue = vm.moment(vm.registrationDate).format('YYYY-MM-DD');
      } else {
        vm.dateFilterValue = '';
      }
    });

    function init() {
      vm.eventregistrations = EventregistrationsService.query(function(data) {
        _.each(data, function(eventregistration) {
          eventregistration.registrationDate = vm.moment(eventregistration.registrationDate).format('YYYY-MM-DD');
          vm.getEventRegistrationTotalPayments(eventregistration);
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

    vm.hasPendingPayment = function(eventRegistration) {
      return eventRegistration.balanceAmount > 0;
    };

    vm.getStatusClass = function(eventRegistration) {
      return vm.hasPendingPayment(eventRegistration) ? 'danger' : 'success';
    };

    vm.orderByMe = function(x) {
      vm.myOrderBy = x;
    };

    vm.getEventRegistrationTotalPayments = function(eventRegistration) {
      eventRegistration.totalPayments = 0;
      vm.receiptsByEventRegistrationService.query({
        'eventRegistrationId': eventRegistration._id
      }, function(data) {
        if (data.length > 0) {
          _.each(data, function(receipt) {
            eventRegistration.totalPayments += receipt.paymentAmount;
          });
        }
      });
    };
  }
})();