(function () {
  'use strict';

  // Moneycollections controller
  angular
    .module('moneycollections')
    .controller('MoneycollectionsController', MoneycollectionsController);

  MoneycollectionsController.$inject = ['$scope', '$state', '$stateParams', 'Authentication',
    'moneycollectionResolve', '$rootScope', 'Notification', '$filter'
  ];

  function MoneycollectionsController($scope, $state, $stateParams, Authentication, moneycollection,
    $rootScope, Notification, $filter) {
    var vm = this;

    $scope.groups = [
      {
        title: 'Dynamic Group Header - 1',
        content: 'Dynamic Group Body - 1'
      },
      {
        title: 'Dynamic Group Header - 2',
        content: 'Dynamic Group Body - 2'
      }
    ];

    $scope.items = ['Item 1', 'Item 2', 'Item 3'];

    $scope.addItem = function () {
      var newItemNo = $scope.items.length + 1;
      $scope.items.push('Item ' + newItemNo);
    };

    $scope.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    };

    vm.authentication = Authentication;
    vm.moneycollection = moneycollection;
    vm.error = null;
    vm.form = {};
    vm.notification = Notification;

    if (!vm.moneycollection._id) {
      var stringDate = $filter('date')(new Date(), 'dd-MMM-yyyy');
      vm.moneycollection.name = 'Conteo ' + stringDate;
      vm.moneycollection.date = new Date();
      vm.moneycollection.total = 0;
      vm.moneycollection.exchangeRate = 0;
    } else {
      vm.moneycollection.date = new Date(vm.moneycollection.date);
    }

    vm.flowTypes = [
      'Diezmo',
      'Ofrenda',
      'Grupo vida',
      'Dicipulado',
      'Soda',
      'Otro'
    ];
    vm.getFlowTypeTotal = function (type, accountingType) {
      var isExpense = accountingType === 'Egresos' ? true : false;
      var result = 0;
      if (vm.moneycollection.summary) {
        switch (type) {
          case 'Diezmo':
            result = isExpense ? vm.moneycollection.summary.totalDiezmosEgresos : vm.moneycollection.summary.totalDiezmos;
            break;
          case 'Ofrenda':
            result = isExpense ? vm.moneycollection.summary.totalOfrendasEgresos : vm.moneycollection.summary.totalOfrendas;
            break;
          case 'Grupo vida':
            result = isExpense ? vm.moneycollection.summary.totalGruposVidaEgresos : vm.moneycollection.summary.totalGruposVida;
            break;
          case 'Dicipulado':
            result = isExpense ? vm.moneycollection.summary.totalDicipuladosEgresos : vm.moneycollection.summary.totalDicipulados;
            break;
          case 'Soda':
            result = isExpense ? vm.moneycollection.summary.totalSodasEgresos : vm.moneycollection.summary.totalSodas;
            break;
          case 'Otro':
            result = isExpense ? vm.moneycollection.summary.totalOtrosEgresos : vm.moneycollection.summary.totalOtros;
            break;
        }
      }
      return result;
    }

    vm.getFlowTypeDescription = function (type, accountingType) {
      var isExpense = accountingType === 'Egresos' ? true : false;
      var result = '';
      if (vm.moneycollection.summary) {
        switch (type) {
          case 'Diezmo':
            result = isExpense ? vm.getTextFromSummaryDescriptionArray(vm.moneycollection.summary.descripcionesDiezmosEgresos) : vm.getTextFromSummaryDescriptionArray(vm.moneycollection.summary.descripcionesDiezmos);
            break;
          case 'Ofrenda':
            result = isExpense ? vm.getTextFromSummaryDescriptionArray(vm.moneycollection.summary.descripcionesOfrendasEgresos) : vm.getTextFromSummaryDescriptionArray(vm.moneycollection.summary.descripcionesOfrendas);
            break;
          case 'Grupo vida':
            result = isExpense ? vm.getTextFromSummaryDescriptionArray(vm.moneycollection.summary.descripcionesGruposVidaEgresos) : vm.getTextFromSummaryDescriptionArray(vm.moneycollection.summary.descripcionesGruposVida);
            break;
          case 'Dicipulado':
            result = isExpense ? vm.getTextFromSummaryDescriptionArray(vm.moneycollection.summary.descripcionesDicipuladosEgresos) : vm.getTextFromSummaryDescriptionArray(vm.moneycollection.summary.descripcionesDicipulados);
            break;
          case 'Soda':
            result = isExpense ? vm.getTextFromSummaryDescriptionArray(vm.moneycollection.summary.descripcionesSodasEgresos) : vm.getTextFromSummaryDescriptionArray(vm.moneycollection.summary.descripcionesSodas);
            break;
          case 'Otro':
            result = isExpense ? vm.getTextFromSummaryDescriptionArray(vm.moneycollection.summary.descripcionesOtrosEgresos) : vm.getTextFromSummaryDescriptionArray(vm.moneycollection.summary.descripcionesOtros);
            break;
        }
      }
      return result;
    }

    vm.getTextFromSummaryDescriptionArray = function (summaryDescriptionArray) {
      var textDescription = '';
      if (summaryDescriptionArray && summaryDescriptionArray.length) {
        for (var i = 0; i <= summaryDescriptionArray.length - 1; i++) {
          textDescription += summaryDescriptionArray[i];
          if (i < summaryDescriptionArray.length - 1) {
            textDescription += ', ';
          }
        }
      }
      return textDescription;
    };

    vm.calculateFlowsTotal = function () {
      var flowsTotal = 0;
      _.each(vm.moneycollection.moneyFlows, function (flow, index) {
        var total = flow.total ? flow.total : 0;
        if (flow.isExpense) {
          flowsTotal = flowsTotal - total;
        } else {
          flowsTotal += total;
        }

        if (index === vm.moneycollection.moneyFlows.length - 1) {
          vm.moneycollection.total = flowsTotal;
        }
      });
    };

    // Remove existing Event
    vm.remove = function remove() {
      if (confirm('Seguro que desea eliminar este flujo de dinero?')) {
        vm.moneycollection.$remove($state.go('moneycollections.list'));
      }
    }

    vm.save = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.moneycollectionForm');
        Notification.error({ message: 'Complete todos los campos requeridos', title: '<i class="glyphicon glyphicon-remove"> Error en el formulario</i>' });
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.moneycollection._id) {
        vm.moneycollection.$update(successCallback, errorCallback);
      } else {
        vm.moneycollection.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('moneycollections.view', {
          moneycollectionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Error al guardar!' });
      }
    };
  }
})();