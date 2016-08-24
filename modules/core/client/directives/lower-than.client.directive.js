(function() {
  'use strict';

  angular.module('core')
    .directive('lowerThan', lowerThan);

  //lowerThan.$inject = ['FileSaver', 'Blob'];

  function lowerThan() {
    var directive = {
      restrict: 'A',
      require: 'ngModel',
      link: link
    };

    return directive;

    function link($scope, $element, $attrs, ctrl) {
      var validate = function(viewValue) {
        var comparisonModel = $attrs.lowerThan;

        if (!viewValue || viewValue === '' || !comparisonModel || comparisonModel === '') {
          // It's valid because we have nothing to compare against
          ctrl.$setValidity('lowerThan', true);
        } else {
          // It's valid if model is lower than the model we're comparing against
          ctrl.$setValidity('lowerThan', parseInt(viewValue, 10) <= parseInt(comparisonModel, 10));
          return viewValue;
        }
      };

      ctrl.$parsers.unshift(validate);
      ctrl.$formatters.push(validate);

      $attrs.$observe('lowerThan', function(comparisonModel) {
        return validate(ctrl.$viewValue);
      });
    }
  }
}());