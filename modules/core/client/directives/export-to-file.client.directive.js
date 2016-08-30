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
        var data = new Blob([$('#' + contentId).html()], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
        });
        /*$('#' + contentId).tableExport({
          escape: 'true',
          htmlContent: 'false',
          headings: true, // (Boolean), display table headings (th/td elements) in the <thead>
          footers: true, // (Boolean), display table footers (th/td elements) in the <tfoot>
          formats: ["csv"], // (String[]), filetype(s) for the export
          fileName: filename, // (id, String), filename for the downloaded file
          type: 'csv',
          bootstrap: true, // (Boolean), style buttons using bootstrap
          position: "bottom", // (top, bottom), position of the caption element relative to table
          ignoreRows: null, // (Number, Number[]), row indices to exclude from the exported file
          ignoreCols: null, // (Number, Number[]), column indices to exclude from the exported file
          ignoreCSS: ".tableexport-ignore" // (selector, selector[]), selector(s) to exclude from the exported file
        });*/
        FileSaver.saveAs(data, filename + '.csv');
      }
    }
  }
}());