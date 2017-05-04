(function() {
  'use strict';

  angular.module('core')
    .directive('loadingSpinner', loadingSpinner);

  loadingSpinner.$inject = ['$rootScope', '$uibModal', '$log', '$timeout'];

  function loadingSpinner($rootScope, $uibModal, $log, $timeout) {
    var directive = {
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {},
      bindToController: {
        //visible: '@'
        // onSown: '&',
        // onHide: '&'
      },
      controller: loadingSpinnerCtrl,
      controllerAs: '$ctrl'
    };

    return directive;

    function loadingSpinnerCtrl($scope, $element, $attrs) {
      var $ctrl = this;
      $ctrl.items = ['item1', 'item2', 'item3'];

      $ctrl.animationsEnabled = true;
      $ctrl.modalInstance;

      $ctrl.openComponentModal = function() {
        $ctrl.modalInstance = $uibModal.open({
          animation: $ctrl.animationsEnabled,
          backdrop: 'static',
          keyboard: false,
          size: 'sm',
          templateUrl: 'modules/core/client/views/loading-spinner.client.view.html'
        });
        $ctrl.time = $timeout(function() { // Timeout 
          if ($ctrl.modalInstance)
            $ctrl.modalInstance.dismiss('cancel')
        }, 15000);
      };

      //$attrs.$observe('visible', function(value) {
      $rootScope.$watch('showLoadingSpinner', function(newVal, oldVal) {
        if (newVal) {
          $ctrl.openComponentModal();
        } else if ($ctrl.modalInstance) {
          $ctrl.modalInstance.close();
        }
      });
    }
  }
}());