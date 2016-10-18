(function() {
  'use strict';

  angular
    .module('eventregistrations')
    .controller('EventregistrationsReportController', EventregistrationsReportController);

  EventregistrationsReportController.$inject = ['$scope', 'EventregistrationsService',
    'EventsService', 'EventpeoplegroupsService', 'PersontypesService', 'ReceiptsByEventRegistrationService', '$timeout'
  ];

  function EventregistrationsReportController($scope, EventregistrationsService, EventsService,
    EventpeoplegroupsService, PersontypesService, ReceiptsByEventRegistrationService, $timeout) {
    var vm = this;
    vm.receiptsByEventRegistrationService = ReceiptsByEventRegistrationService;
    vm.events = EventsService.query();
    vm.eventPeopleGroups = EventpeoplegroupsService.query();
    vm.personTypes = PersontypesService.query();
    init();

    function init() {
      vm.eventregistrations = EventregistrationsService.query(function(data) {
        _.each(data, function(eventregistration) {
          vm.getEventRegistrationTotalPayments(eventregistration);
        });
      });
      vm.shirtTypesGroups = [];
    }

    // vm.getTotalShirtTypes = function(eventregistrations) {
    //   vm.shitTypesList = [];
    //   _.each(eventregistrations, function(eventregistration) {
    //     vm.getShirtTypes(eventregistration);
    //   });
    //   _.groupBy(vm.shitTypesList, 'shirtSize');
    // };

    // vm.getShirtTypes = function(eventregistration) {
    //   if (!vm.shitTypesList) {
    //     vm.shitTypesList = [];
    //   }
    //   if (eventregistration.shirtTypes.length > 0) {
    //     vm.shitTypesList = _.concat(vm.shitTypesList, eventregistration.shirtTypes);
    //   }
    // };

    vm.getTotalShirtTypes = function(eventregistrations) {
      var shirtTypesList = [];
      _.each(eventregistrations, function(eventregistration, key) {
        for (var i = 0; i < eventregistration.shirtTypes.length; i++) {
          shirtTypesList.push(eventregistration.shirtTypes[i]);
        }
        vm.getShirtTypes(eventregistration, shirtTypesList);
        if (key === eventregistrations.length - 1) {
          //vm.shirtTypesGroups = _.groupBy(shirtTypesList, 'shirtSize');
          vm.shirtTypesGroups = shirtTypesList;
          // _.each(shirtTypesList, function(group) {

          //   var existingShirtTypeIndex = _.findIndex(shirtTypesList, function(o) {
          //     return (o.shirtTypeName === group.shirtTypeName &&
          //       o.shirtTypeColor === group.shirtTypeColor &&
          //       o.shirtSize === group.shirtSize);
          //   });
          //   if (existingShirtTypeIndex < 0) {
          //     shirtTypesList.push({
          //       shirtTypeSize: group.shirtTypeSize,
          //       shirtTypeName: group.shirtTypeName,
          //       shirtTypeColor: group.shirtTypeColor,
          //       quantity: group.quantity
          //     });
          //   } else {
          //     shirtTypesList[existingShirtTypeIndex].quantity += group.quantity;
          //   }
          // });
        }
      });
      $scope.$watch('vm.shirtTypesGroups', function(newValue) {
        if (vm.shirtTypesGroup && vm.shirtTypesGroup.length === 0 && newValue.length > 0) {
          vm.shirtTypesGroups = _.clone(shirtTypesList);
        }
      });
      $timeout(function() {
        console.log("Running after the digest cycle");

      }, 0, false);

      // $timeout(function() {
      //   if (vm.shirtTypesGroups.length === 0 && shirtTypesList.length > 0)
      //     $scope.$eval(function() {
      //       vm.shirtTypesGroups = shirtTypesList;
      //     });
      // }, 10);
    };

    vm.getShirtTypes = function(eventregistration, shirtTypesList) {
      _.each(eventregistration.shirtTypes, function(eventRegistrationShirtType) {
        var existingShirtTypeIndex = _.findIndex(shirtTypesList, function(o) {
          return (o.shirtTypeName === eventRegistrationShirtType.shirtTypeName &&
            o.shirtTypeColor === eventRegistrationShirtType.shirtTypeColor &&
            o.shirtSize === eventRegistrationShirtType.shirtSize);
        });
        if (eventRegistrationShirtType.quantity > 0) {
          if (existingShirtTypeIndex >= 0) {
            shirtTypesList[existingShirtTypeIndex].quantity += eventRegistrationShirtType.quantity;
          } else {
            shirtTypesList.push(eventRegistrationShirtType);
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