(function () {
  'use strict';

  angular
    .module('people')
    .directive('savePerson', savePerson);

  savePerson.$inject = ['$rootScope', 'OrganizationsService'];

  function savePerson($rootScope, OrganizationsService) {
    return {
      templateUrl: 'modules/people/client/views/save-person.client.view.html',
      restrict: 'E',
      scope: {
        person: '=',
        successCallback: '@',
        errorCallback: '@'
      },
      link: function postLink(scope, element, attrs) {
        scope.save = save;
        
        scope.organizations = OrganizationsService.query();
        scope.setOrganization = function (organization) {
          scope.person.organization = organization;
        };

        scope.personTypes = ['Encuentrista', 'Lider'];
        scope.setPersonType = function (personType) {
          scope.person.personType = personType;
        };

        scope.maritalStatuses = ['Soltero(a)', 'Comprometido(a)', 'Casado(a)', 'Unión Libre', 'Divorciado(a)', 'Viudo(a)'];
        scope.setMaritalStatus = function (maritalStatus) {
          scope.person.maritalStatus = maritalStatus;
        };

        scope.shirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
        scope.setShirtSize = function (shirtSize) {
          scope.person.shirtSize = shirtSize;
        };

        scope.grades = 
        ['Ninguna', 
        'Primaria incompleta', 
        'Primaria completa', 
        'Secundatia incompleta', 
        'Secundatia completa', 
        'Bachiller Universitario incompleto',
        'Bachiller Universitario completo',
        'Licenciatura Universitaria incompleto',
        'Licenciatura Universitaria completo',
        'Maestría Universitaria incompleto',
        'Maestría Universitaria completo',
        'Doctorado Universitaria incompleto',
        'Doctorado Universitaria completo',
        'Otro(a)'];
        scope.setGrade = function (grade) {
          scope.person.grade = grade;
        };


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
