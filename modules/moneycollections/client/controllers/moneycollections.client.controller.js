(function() {
  'use strict';

  // Moneycollections controller
  angular
    .module('moneycollections')
    .controller('MoneycollectionsController', MoneycollectionsController);

  MoneycollectionsController.$inject = ['$scope', '$anchorScroll', '$state', '$stateParams', 'Authentication',
    'moneycollectionResolve', 'CurrentEventsService', 'EventpeoplegroupsService', 'personResolve',
    'PeopleService', 'MoneycollectionsByEventService', '$rootScope', 'PersontypesService', 'Notification',
    'StudentsService'
  ];

  function MoneycollectionsController($scope, $anchorScroll, $state, $stateParams, Authentication, moneycollection,
    CurrentEventsService, EventpeoplegroupsService, person, PeopleService, MoneycollectionsByEventService, $rootScope,
    PersontypesService, Notification, StudentsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.moneycollection = moneycollection;
    vm.error = null;
    vm.form = {};
    vm.events = CurrentEventsService.query();
    vm.eventPeopleGroups = EventpeoplegroupsService.query();
  }
})();