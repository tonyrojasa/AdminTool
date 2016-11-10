(function() {
  'use strict';

  angular
    .module('eventregistrations')
    .controller('EventregistrationsReportController', EventregistrationsReportController);

  EventregistrationsReportController.$inject = ['$scope', 'EventregistrationsByEventService',
    'EventsService', 'EventpeoplegroupsService', 'PersontypesService', 'ReceiptsByEventRegistrationService', '$timeout', 'moment',
    'EventgroupsService'
  ];

  function EventregistrationsReportController($scope, EventregistrationsByEventService, EventsService,
    EventpeoplegroupsService, PersontypesService, ReceiptsByEventRegistrationService, $timeout, moment, EventgroupsService) {
    var vm = this;
    vm.moment = moment;
    vm.receiptsByEventRegistrationService = ReceiptsByEventRegistrationService;
    vm.events = EventsService.query();
    vm.eventPeopleGroups = EventpeoplegroupsService.query();
    vm.personTypes = PersontypesService.query();

    $scope.$watch('vm.registrationDate', function(newVal, oldVal) {
      if (newVal) {
        vm.dateFilterValue = vm.moment(vm.registrationDate).format('YYYY-MM-DD');
      } else {
        vm.dateFilterValue = '';
      }
    });

    vm.setEvent = function(event) {
      vm.loadEventgroups(event._id, function(eventGroups) {
        vm.eventregistrations = EventregistrationsByEventService.query({
          'eventId': event._id
        }, function(data) {
          _.each(data, function(eventregistration) {
            vm.setEventRegistrationEventGroup(eventGroups, eventregistration);

            eventregistration.registrationDate = vm.moment(eventregistration.registrationDate).format('YYYY-MM-DD');
            vm.getEventRegistrationTotalPayments(eventregistration);
          });
        });
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

    vm.setEventRegistrationEventGroup = function(eventGroups, eventregistration) {
      var a = _.find(eventGroups, {
        '_id': eventregistration._id
      });
      _.each(eventGroups, function(eventGroup, key) {
        if (eventGroup.leader && eventGroup.leader._id === eventregistration._id) {
          eventregistration.eventGroup = eventGroup.name + ' (Líder)';
        } else if (eventGroup.assistant && eventGroup.assistant._id === eventregistration._id) {
          eventregistration.eventGroup = eventGroup.name + ' (Asistente)';
        } else {
          var member = _.find(eventGroup.members, function(o) {
            return o._id === eventregistration._id;
          });
          if (member) {
            eventregistration.eventGroup = eventGroup.name;
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