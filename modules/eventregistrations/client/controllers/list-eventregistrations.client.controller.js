(function() {
  'use strict';

  angular
    .module('eventregistrations')
    .controller('EventregistrationsListController', EventregistrationsListController);

  EventregistrationsListController.$inject = ['EventregistrationsService', 'CurrentEventsService', 'FileSaver', 'Blob'];

  function EventregistrationsListController(EventregistrationsService, CurrentEventsService, FileSaver, Blob) {
    var vm = this;
    vm.events = CurrentEventsService.query();
    vm.eventregistrations = EventregistrationsService.query();
    vm.setEvent = setEvent;
    vm.exportToExcel = exportToExcel;

    function exportToExcel() {
      var data = new Blob([document.getElementById('exportable').innerHTML], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
      });
      FileSaver.saveAs(data, 'INSCRIPCIONES.xls');
    }

    //set registration event
    function setEvent(event) {
      vm.event = event;
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
      return vm.hasPendingPayment(eventRegistration) ? 'warning' : 'success';
    };

  }
})();