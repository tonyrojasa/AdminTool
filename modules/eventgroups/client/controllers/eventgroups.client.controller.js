(function() {
  'use strict';

  // Eventgroups controller
  angular
    .module('eventgroups')
    .controller('EventgroupsController', EventgroupsController);

  EventgroupsController.$inject = ['$scope', '$state', 'Authentication', 'eventgroupResolve', 'EventregistrationsByEventService',
    'CurrentEventsService', 'EventpeoplegroupsService', 'EventgroupsService', '$anchorScroll'
  ];

  function EventgroupsController($scope, $state, Authentication, eventgroup, EventregistrationsByEventService, CurrentEventsService,
    EventpeoplegroupsService, EventgroupsService, $anchorScroll) {
    var vm = this;

    vm.authentication = Authentication;
    vm.eventgroup = eventgroup;
    vm.error = null;
    vm.form = {};
    vm.editMode = vm.eventgroup._id ? true : false;
    vm.events = CurrentEventsService.query();
    vm.eventPeopleGroups = EventpeoplegroupsService.query();
    vm.remove = remove;
    vm.save = save;
    vm.setEvent = setEvent;
    vm.isOptionDisabled = isOptionDisabled;
    vm.setEventPeopleGroup = setEventPeopleGroup;

    vm.loadUnassgnedRegistrations = function(eventId) {
      var query = {
        event: eventId
      };

      EventregistrationsByEventService.query({
        'eventId': eventId
      }, function(data) {
        var eventRegistrations = data;
        EventgroupsService.query(query, function(data) {
          vm.filterEventRegistrations(data, eventRegistrations);
        });
      });
    };

    vm.filterEventRegistrations = function(eventgroups, eventRegistrations) {
      vm.unassignedRegistrations = eventRegistrations;

      _.each(eventgroups, function(eventgroup) {
        var members = eventgroup.members;
        if (eventgroup._id !== vm.eventgroup._id) {
          //remove leader from list if exist if exist in other eventgroup
          if (eventgroup.leader) {
            vm.unassignedRegistrations = _.differenceBy(vm.unassignedRegistrations, [eventgroup.leader], '_id');
          }
          //remove assistant from list if exist in other eventgroup
          if (eventgroup.assistant) {
            vm.unassignedRegistrations = _.differenceBy(vm.unassignedRegistrations, [eventgroup.assistant], '_id');
          }
          _.each(members, function(member) {
            var availabaleUnassignedRegistrations = _.differenceBy(vm.unassignedRegistrations, members, '_id');

            if (availabaleUnassignedRegistrations.length > 1) {
              vm.unassignedRegistrations = availabaleUnassignedRegistrations;
            }
          });
        }
      });
    };


    vm.getMemberIds = function() {
      if (vm.eventgroup && vm.eventgroup.members) {
        var parsedMembersArray = [];
        for (var index in vm.eventgroup.members) {
          if (vm.eventgroup.members[index]._id) {
            parsedMembersArray.push(vm.eventgroup.members[index]._id);
          }
        }
        return parsedMembersArray;
      }
    };

    vm.membersFilterAlreadyAdded = function(item) {
      var memberIds = vm.getMemberIds();
      return (memberIds.indexOf(item._id) === -1);
    };

    function init() {
      if (!vm.eventgroup.members) {
        vm.eventgroup.members = [];
      }
      if (vm.editMode) {
        vm.loadUnassgnedRegistrations(vm.eventgroup.event._id);
      }
    }

    init();

    //set registration event
    function setEvent(event) {
      vm.unassignedRegistrations = null;
      vm.eventgroup.eventPeopleGroup = undefined;
      vm.eventgroup.leader = undefined;
      vm.eventgroup.assistant = undefined;
      vm.eventgroup.members = [];
      vm.loadUnassgnedRegistrations(event._id);
    }

    function isOptionDisabled() {
      return vm.eventgroup._id && !vm.authentication.isUserAdmin();
    }

    function setEventPeopleGroup() {
      vm.eventgroup.leader = undefined;
      vm.eventgroup.assistant = undefined;
      vm.eventgroup.members = [];
    }

    // Remove existing Eventgroup
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.eventgroup.$remove($state.go('eventgroups.list'));
      }
    }

    // Save Eventgroup
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.eventgroupForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.eventgroup._id) {
        vm.eventgroup.$update(successCallback, errorCallback);
      } else {
        vm.eventgroup.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('eventgroups.view', {
          eventgroupId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        if (vm.error === 'Name_1_event already exists') {
          vm.error = 'Ya existe una cabaña con este nombre en el evento y grupo indicado.';
          $anchorScroll(document.body.scrollTop);
        }
      }
    }
  }
})();