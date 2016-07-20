(function() {
  'use strict';

  angular
    .module('core')
    .filter('sumByKey', sumByKey);

  function sumByKey() {
    return function(data, key) {
      if (typeof(data) === 'undefined' || typeof(key) === 'undefined') {
        return 0;
      }

      var sum = 0;
      for (var i = data.length - 1; i >= 0; i--) {
        sum += parseInt(data[i][key], 10);
      }

      return sum;
    };
  }
})();