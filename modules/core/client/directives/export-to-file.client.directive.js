(function() {
  'use strict';

  angular.module('core')
    .directive('exportToFile', pageTitle);

  pageTitle.$inject = ['FileSaver', 'Blob'];

  function pageTitle(FileSaver, Blob) {
    var directive = {
      templateUrl: 'modules/core/client/views/export-to-file.client.view.html',
      restrict: 'E',
      scope: {
        linkText: '@',
        elementId: '@',
        format: '@',
        fileName: '@'
      },
      link: link
    };

    return directive;

    function link(scope, element) {
      scope.exportClick = exportClick;
      scope.exportToExcel = exportToExcel;

      function exportClick() {
        if (scope.format === 'excel') {
          scope.exportToExcel(scope.elementId, scope.fileName);
        }
      }

      function exportToExcel(contentId, filename) {
        var data = new Blob([document.getElementById(contentId).innerHTML], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
        });
        FileSaver.saveAs(data, filename + '.xls');
      }
    }
  }
}());