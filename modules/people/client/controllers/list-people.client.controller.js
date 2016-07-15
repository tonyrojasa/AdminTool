(function() {
  'use strict';

  angular
    .module('people')
    .controller('PeopleListController', PeopleListController);

  PeopleListController.$inject = ['PeopleService', 'FileSaver', 'Blob'];

  function PeopleListController(PeopleService, FileSaver, Blob) {
    var vm = this;
    vm.people = PeopleService.query();
    vm.exportToExcel = exportToExcel;

    function exportToExcel() {
      var data = new Blob([document.getElementById('exportable').innerHTML], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
      });
      FileSaver.saveAs(data, 'INSCRIPCIONES.xls');
    }

  }
})();