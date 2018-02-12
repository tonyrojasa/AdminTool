(function() {
  'use strict';

  angular
    .module('people')
    .directive('moneyFlow', moneyFlow);

  function moneyFlow() {
    return {
      templateUrl: 'modules/moneycollections/client/views/moneyflow.client.view.html',
      restrict: 'E',
      replace: true,
      scope: {
        flows: '=',
        form: '=',
        readonly: '=',
        report: '=',
        showLabels: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.types = [
          'Diezmo',
          'Ofrenda',
          'Grupo vida',
          'Dicipulado',
          'Soda',
          'Otro'
        ];

        scope.calculateNumberOfTotal = function(quantity, amount) {
          return quantity ? quantity * amount : 0;
        };

        scope.getCoinsTotal = function(item) {
          var result = scope.calculateNumberOfTotal() + 
           scope.calculateNumberOfTotal(item.numberOf500, 500) + 
           scope.calculateNumberOfTotal(item.numberOf100, 100) + 
           scope.calculateNumberOfTotal(item.numberOf50, 50) + 
           scope.calculateNumberOfTotal(item.numberOf25, 25) + 
           scope.calculateNumberOfTotal(item.numberOf10, 10) +
           scope.calculateNumberOfTotal(item.numberOf5, 5);

          return result;
        };

        scope.getBillsTotal = function(item) {
          var result = scope.calculateNumberOfTotal() + 
           scope.calculateNumberOfTotal(item.numberOf50000, 50000) + 
           scope.calculateNumberOfTotal(item.numberOf20000, 20000) +
           scope.calculateNumberOfTotal(item.numberOf10000, 10000) + 
           scope.calculateNumberOfTotal(item.numberOf5000, 5000) + 
           scope.calculateNumberOfTotal(item.numberOf2000, 2000) + 
           scope.calculateNumberOfTotal(item.numberOf1000, 1000);

          return result;
        };

        scope.addFlow = function() {
          if (!scope.flows) {
            scope.flows = [];
          }
          scope.flows.push({
            type: '',
            isDetailed: true,
            isExpense: false,
            exchangeRate: 0,
            coins: {
              numberOf500: 0,
              numberOf100: 0,
              numberOf50: 0,
              numberOf25: 0,
              numberOf10: 0,
              numberOf5: 0,
              numberOfDollars: 0
            },  
            bills: {
              numberOf50000: 0,
              numberOf20000: 0,
              numberOf10000: 0,
              numberOf5000: 0,
              numberOf2000: 0,
              numberOf1000: 0
            },
            collectors: [],
            total: 0,
            comments: ''
          });
        };

        scope.removeFlow = function(index) {
          scope.flows.splice(index, 1);
        };
        
      }
    };
  }
})();