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

        scope.gruposVida = [
          'Canoas',
          'Centro Adultos',
          'Centro Intermedio',
          'El Coyol',
          'El Roble',
          'Invu',
          'San Antonio',
          'Villa Bonita',
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

        scope.isDescriptionVivible = function(item) {
          return item.type !== 'Grupo vida' || item.isExpense;
        };

        scope.onFlowDescriptionDisabled = function (item) {
          if (item.type === 'Grupo vida') {
            item.description = item.isExpense ? 'Reintegro' : '';
            return true;
          } else if (item.type && (item.type === 'Diezmo' || item.type === 'Ofrenda' || item.type === 'Grupo vida')) {
            item.description = item.type !== 'Grupo vida' ? 'Conteo' : '';
            return true;
          }
          return false;
        };

        scope.addFlow = function () {
          if (!scope.flows) {
            scope.flows = [];
          }
          _.each(scope.flows, function (flow) {
            flow.open = false;
          });
          scope.flows.push(scope.getNewFlow());
        };

        scope.getNewFlow = function (type, description, comments, isExpense, isDetailed, date) {
          return {
            open: true,
            type: type ? type : '',
            description: description ? description : '',
            comments: comments ? comments : '',
            isDetailed: isDetailed != undefined ? isDetailed : true,
            isExpense: isExpense ? isExpense : false,
            numberOfDollars: 0,
            date: date ? date : new Date(),
            coins: {
              numberOf500: '',
              numberOf100: '',
              numberOf50: '',
              numberOf25: '',
              numberOf10: '',
              numberOf5: ''
            },
            bills: {
              numberOf50000: '',
              numberOf20000: '',
              numberOf10000: '',
              numberOf5000: '',
              numberOf2000: '',
              numberOf1000: ''
            },
            collectors: [],
            reportedTotal: '',
            total: ''
          };
        };

        scope.checkIsDetailed = function (flowIndex) {
          if (scope.flows[flowIndex].isDetailed === false) {
            if (confirm('Si deshabilita flujo detallado perdera los cambios. Seguro que desea deshabilitarlo?')) {
              scope.flows[flowIndex] = scope.getNewFlow(scope.flows[flowIndex].type,
                scope.flows[flowIndex].description,
                scope.flows[flowIndex].comments,
                scope.flows[flowIndex].isExpense,
                false,
                scope.flows[flowIndex].date);
            } else {
              scope.flows[flowIndex].isDetailed = true;
            }
          } else {
            if (confirm('Si habilita flujo detallado perdera los cambios en los totales. Seguro que desea habilitarlo?')) {
              scope.flows[flowIndex].isDetailed = true;
            } else {
              scope.flows[flowIndex].isDetailed = false;
            }
          }
          return scope.flows[flowIndex];
        };

        scope.checkIsExpense = function (flowIndex) {
          if (scope.flows[flowIndex].isExpense === true) {
            if (scope.flows[flowIndex].type && (scope.flows[flowIndex].type === 'Grupo vida')) {
              scope.flows[flowIndex].description = 'Reintegro';
            } else {
              scope.flows[flowIndex].description = '';
            }
          } else {
            if (scope.flows[flowIndex].type && (scope.flows[flowIndex].type === 'Grupo vida')) {
              scope.flows[flowIndex].description = '';
            } 
          }
        };

        scope.removeFlow = function (index) {
          if (confirm('Seguro que desea eliminar el flujo #' + (index + 1) + '? Perdera todos los cambios')) {
            scope.flows.splice(index, 1);
          }
        };

      }
    };
  }
})();