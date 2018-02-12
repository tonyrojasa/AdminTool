(function () {
  'use strict';

  // Moneycollections controller
  angular
    .module('moneycollections')
    .controller('MoneycollectionsController', MoneycollectionsController);

  MoneycollectionsController.$inject = ['$scope', '$state', '$stateParams', 'Authentication',
    'moneycollectionResolve', '$rootScope', 'Notification'
  ];

  function MoneycollectionsController($scope, $state, $stateParams, Authentication, moneycollection,
    $rootScope, Notification) {
    var vm = this;

    vm.authentication = Authentication;
    vm.moneycollection = moneycollection;
    vm.error = null;
    vm.form = {};

    if (!vm.moneycollection._id) {
      vm.moneycollection.date = new Date();
      vm.moneycollection.total = 0;
    }


    vm.calculateFlowsTotal = function () {
      debugger;
      var flowsTotal = 0;
      return _.each(vm.moneycollection.moneyFlows, function (flow, index) {
        debugger;
        flowsTotal += flow.total;
        if (index === vm.moneycollection.moneyFlows.length - 1) {
          vm.moneycollection.total = flowsTotal;
        }
      })
    };

    vm.save = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.moneycollectionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.moneycollection._id) {
        vm.moneycollection.$update(successCallback, errorCallback);
      } else {
        vm.moneycollection.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('moneycollection.view', {
          moneycollectionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };
  }
})();