(function () {
  'use strict';

  angular
    .module('people')
    .directive('moneyFlow', moneyFlow);

  moneyFlow.$inject = ['moment'];
  function moneyFlow() {
    return {
      templateUrl: 'modules/moneycollections/client/views/moneyflow.client.view.html',
      restrict: 'E',
      replace: true,
      scope: {
        flows: '=',
        exchangeRate: '=',
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

        if (scope.flows && scope.flows.length) {
          _.each(scope.flows, function (flow, index) {
            flow.date = new Date(flow.date);
          });
        }

        scope.calculateNumberOfTotal = function (quantity, amount) {
          amount = amount ? amount : 0;
          return quantity ? quantity * amount : 0;
        };

        scope.getCoinsTotal = function (item) {
          var result = scope.calculateNumberOfTotal() +
            scope.calculateNumberOfTotal(item.coins.numberOf500, 500) +
            scope.calculateNumberOfTotal(item.coins.numberOf100, 100) +
            scope.calculateNumberOfTotal(item.coins.numberOf50, 50) +
            scope.calculateNumberOfTotal(item.coins.numberOf25, 25) +
            scope.calculateNumberOfTotal(item.coins.numberOf10, 10) +
            scope.calculateNumberOfTotal(item.coins.numberOf5, 5);

          return result;
        };

        scope.getBillsTotal = function (item) {
          var result = scope.calculateNumberOfTotal() +
            scope.calculateNumberOfTotal(item.bills.numberOf50000, 50000) +
            scope.calculateNumberOfTotal(item.bills.numberOf20000, 20000) +
            scope.calculateNumberOfTotal(item.bills.numberOf10000, 10000) +
            scope.calculateNumberOfTotal(item.bills.numberOf5000, 5000) +
            scope.calculateNumberOfTotal(item.bills.numberOf2000, 2000) +
            scope.calculateNumberOfTotal(item.bills.numberOf1000, 1000);

          return result;
        };

        scope.calculateCoinsAndBillsTotal = function (item) {
          item.total = scope.getCoinsTotal(item) + scope.getBillsTotal(item) +
            scope.calculateNumberOfTotal(item.numberOfDollars, scope.exchangeRate);
          return item.total;
        };

        scope.setDescription = function (item, date) {
          item.description = item.description + ' ' + item.type + ' ' + date;
        };

        scope.addFlow = function () {
          if (!scope.flows) {
            scope.flows = [];
          }
          scope.flows.push({
            type: '',
            description: '',
            isDetailed: true,
            isExpense: false,
            numberOfDollars: 0,
            date: new Date(),
            coins: {
              numberOf500: 0,
              numberOf100: 0,
              numberOf50: 0,
              numberOf25: 0,
              numberOf10: 0,
              numberOf5: 0
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
            reportedTotal: 0,
            total: 0,
            comments: ''
          });
        };

        scope.removeFlow = function (index) {
          if (confirm('Seguro que desea eliminar el flujo #' + (index + 1) + '?')) {
            scope.flows.splice(index, 1);
          }
        };

      }
    };
  }
})();