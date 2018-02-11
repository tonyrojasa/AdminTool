(function() {
  'use strict';

  angular
    .module('moneycollections')
    .controller('MoneycollectionsReportController', MoneycollectionsReportController);

  MoneycollectionsReportController.$inject = ['$rootScope', '$scope', 'MoneycollectionsByEventService',
    'EventsService', 'EventpeoplegroupsService', 'PersontypesService', 'ReceiptsByEventRegistrationService', '$timeout', 'moment',
    'EventgroupsService'
  ];

  function MoneycollectionsReportController($rootScope, $scope, MoneycollectionsByEventService, EventsService,
    EventpeoplegroupsService, PersontypesService, ReceiptsByEventRegistrationService, $timeout, moment, EventgroupsService) {
    var vm = this;
    vm.moment = moment;
    vm.receiptsByEventRegistrationService = ReceiptsByEventRegistrationService;
    vm.events = EventsService.query();
    vm.eventPeopleGroups = EventpeoplegroupsService.query();
    vm.personTypes = PersontypesService.query();
    vm.showMobilePhone = true;
    vm.showStatus = true;

    $scope.$watch('vm.registrationDate', function(newVal, oldVal) {
      if (newVal) {
        vm.dateFilterValue = vm.moment(vm.registrationDate).format('YYYY-MM-DD');
      } else {
        vm.dateFilterValue = '';
      }
    });

    vm.setEvent = function(event) {
      $rootScope.showLoadingSpinner = true;
      vm.loadEventgroups(event._id, function(eventGroups) {
        vm.moneycollections = MoneycollectionsByEventService.query({
          'eventId': event._id
        }, function(data) {
          if (data.length && data.length > 0) {
            vm.lastIndex = data.length - 1;
          } else {
            vm.lastIndex = 0;
            $rootScope.showLoadingSpinner = false;
          }
          _.each(data, function(moneycollection, index) {
            vm.setEventRegistrationEventGroup(eventGroups, moneycollection);

            moneycollection.registrationDate = vm.moment(moneycollection.registrationDate).format('YYYY-MM-DD');
            vm.getEventRegistrationTotalPayments(moneycollection);

            if (index === vm.lastIndex) {
              $rootScope.showLoadingSpinner = false;
            }
          });
        }, function() {
          $rootScope.showLoadingSpinner = false;
        });
      }, function() {
        $rootScope.showLoadingSpinner = false;
      });
    };

    vm.loadEventgroups = function(eventId, callback) {
      EventgroupsService.query({
        event: eventId
      }, function(data) {
        vm.eventGroups = data;
        callback(data);
      });
    };

    vm.setEventRegistrationEventGroup = function(eventGroups, moneycollection) {
      var a = _.find(eventGroups, {
        '_id': moneycollection._id
      });
      _.each(eventGroups, function(eventGroup, key) {
        if (eventGroup.leader && eventGroup.leader._id === moneycollection._id) {
          moneycollection.eventGroup = eventGroup.name + ' (Líder)';
        } else if (eventGroup.assistant && eventGroup.assistant._id === moneycollection._id) {
          moneycollection.eventGroup = eventGroup.name + ' (Asistente)';
        } else {
          var member = _.find(eventGroup.members, function(o) {
            return o._id === moneycollection._id;
          });
          if (member) {
            moneycollection.eventGroup = eventGroup.name;
          }
        }
      });
    };

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