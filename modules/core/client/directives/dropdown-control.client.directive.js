(function () {
  'use strict';

  angular.module('core')
    .directive('dropdowncontrol', dropdowncontrol);

  function dropdowncontrol() {
    return {
      templateUrl: 'modules/core/client/views/dropdown-control.client.view.html',
      restrict: 'E',
      scope: {
        form: '=',
        readonly: '=',
        required: '=',
        labelvalue: '@',
        fieldname: '@',
        showLabels: '=',
        simple: '=',
        collection: '=',
        select: '=',
        model: '=',
        modelFieldOptions: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.getBindHtmlOption = function (item) {
          if (!scope.modelFieldOptions) {
            return item.name;
          } else {
            var modelFieldOptions = '';
            for (var i = 0; i < scope.modelFieldOptions.length; i++) {
              var subOptions = scope.modelFieldOptions[i].split('.');
              if (subOptions.length > 1) {
                var subOptionResult;
                for (var j = 0; j < subOptions.length; j++) {
                  if (!subOptionResult) {
                    subOptionResult = item[subOptions[j]];
                  } else {
                    subOptionResult = subOptionResult[subOptions[j]];
                  }
                }

                modelFieldOptions = subOptionResult;
              } else {
                modelFieldOptions += item[scope.modelFieldOptions[i]];
              }
              if (i < scope.modelFieldOptions.length - 1) {
                modelFieldOptions += ' - ';
              }
            }
            return modelFieldOptions;
          }
        };

        scope.selectItem = function (item) {
          scope.model = item;
          if (scope.select) {
            scope.select(item);
          }
        };
      }
    };
  }
}());
