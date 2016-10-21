(function() {
  'use strict';

  angular
    .module('eventregistrations')
    .controller('EventregistrationsShirtsReportController', EventregistrationsShirtsReportController);

  EventregistrationsShirtsReportController.$inject = ['$scope', 'EventregistrationsByEventService',
    'EventsService', 'EventpeoplegroupsService', 'PersontypesService', '$timeout'
  ];

  function EventregistrationsShirtsReportController($scope, EventregistrationsByEventService, EventsService,
    EventpeoplegroupsService, PersontypesService, $timeout) {
    var vm = this;
    init();

    function init() {
      vm.events = EventsService.query();
      vm.eventPeopleGroups = EventpeoplegroupsService.query();
      vm.personTypes = PersontypesService.query();
      vm.shirtTypesGroups = [];
    }

    vm.onEventSelected = function(event) {
      if (event) {
        vm.eventregistrations = EventregistrationsByEventService.query({
          'eventId': event._id
        }, function(data) {
          vm.shirtTypesGroups = [];
          _.each(data, function(eventregistration, key) {
            vm.getShirtTypes(eventregistration, vm.shirtTypesGroups);
          });
        });
      }
    };

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
        }
      });
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
  }
})();