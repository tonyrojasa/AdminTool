(function () {
  'use strict';

  angular
    .module('people')
    .directive('savePerson', savePerson);

  savePerson.$inject = ['$rootScope'];

  function savePerson($rootScope) {
    return {
      templateUrl: 'modules/people/client/views/save-person.client.view.html',
      restrict: 'E',
      scope: {
        person: '=',
        successCallback: '@',
        errorCallback: '@'
      },
      link: function postLink(scope, element, attrs) {
        // Save person directive logic

        //scope.form = {};
        scope.save = save;
        scope.hola = 'hola';

        scope.personTypes = ['Encuentrista', 'Lider'];
        scope.setPersonType = function (personType){
          scope.person.personType = personType;
        }

        scope.maritalStatuses = ['Soltero(a)', 'Comprometido(a)', 'Casado(a)', 'Unión Libre', 'Divorciado(a)', 'Viudo(a)'];
        scope.setMaritalStatus = function (maritalStatus){
          scope.person.maritalStatus = maritalStatus;
        }

        scope.shirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
        scope.setShirtSize = function (shirtSize){
          scope.person.shirtSize = shirtSize;
        }


        // Save Person
        function save(isValid) {
          if (!isValid) {
            $rootScope.$broadcast('show-errors-check-validity', 'form.personForm');
            return false;
          }

          // TODO: move create/update logic to service
          if (scope.person._id) {
            scope.person.$update(scope.successCallback, scope.errorCallback);
          } else {
            scope.person.$save(scope.successCallback, scope.errorCallback);
          }
        }

      }
    };
  }
})();
