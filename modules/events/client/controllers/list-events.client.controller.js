(function() {
  'use strict';

  angular
    .module('events')
    .controller('EventsListController', EventsListController);

  EventsListController.$inject = ['$rootScope', 'EventsService'];

  function EventsListController($rootScope, EventsService) {
    var vm = this;

    $rootScope.showLoadingSpinner = true;
    vm.events = EventsService.query(function() {
      $rootScope.showLoadingSpinner = false;
    }, function() {
      $rootScope.showLoadingSpinner = false;
    });

    vm.getStatusClass = function(event) {
      if (event.ended) {
        return 'danger';
      } else if (!event.ended && !event.openEnrollment) {
        return 'warning';
      } else {
        return 'success';
      }
    };

    vm.getRegistrationType = function(event) {
      var result = 'Regular';
      if (event.quickRegistration) {
        result = 'Inscripción Rápida';
      } else if (event.nonRegistration) {
        result = 'No requiere inscripción';
      }
      return result;
    }
  }
})();