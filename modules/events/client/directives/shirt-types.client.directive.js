(function() {
  'use strict';

  angular
    .module('people')
    .directive('shirtTypes', shirtTypes);

  function shirtTypes() {
    return {
      templateUrl: 'modules/events/client/views/shirt-types.client.view.html',
      restrict: 'E',
      replace: true,
      scope: {
        shirtTypes: '=',
        form: '=',
        readonly: '@'
      },
      link: function postLink(scope, element, attrs) {
        scope.addShirtType = function(shirtTypeLength) {
          if (!shirtTypeLength) {
            shirtTypeLength = 1;
          } else {
            shirtTypeLength += 1;
          }
          if (!scope.shirtTypes) {
            scope.shirtTypes = [];
          }
          scope.shirtTypes.push({
            shirtTypeName: 'Camisa #' + shirtTypeLength,
            shirtTypeColor: '#fff'
          });
        };

        scope.removeShirtType = function(index) {
          scope.shirtTypes.splice(index, 1);
        };

      }
    };
  }
})();