(function() {
  'use strict';

  angular
    .module('people')
    .directive('personForm', personForm);

  personForm.$inject = ['$rootScope', 'OrganizationsService', 'PersontypesService'];

  function personForm($rootScope, OrganizationsService, PersontypesService) {
    return {
      templateUrl: 'modules/people/client/views/person-form.client.view.html',
      restrict: 'E',
      scope: {
        person: '=',
        form: '=',
        error: '='
      },
      link: function postLink(scope, element, attrs) {
        if (scope.person.birthDate) {
          scope.person.birthDate = new Date(scope.person.birthDate);
        }

        scope.organizations = OrganizationsService.query();
        scope.setOrganization = function(organization) {
          scope.person.organization = organization;
        };

        scope.personTypes = PersontypesService.query();
        scope.setPersonType = function(personType) {
          scope.person.personType = personType;
        };

        scope.maritalStatuses = ['Soltero(a)', 'Comprometido(a)', 'Casado(a)', 'Unión Libre', 'Divorciado(a)', 'Viudo(a)'];
        scope.setMaritalStatus = function(maritalStatus) {
          scope.person.maritalStatus = maritalStatus;
        };

        scope.shirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
        scope.setShirtSize = function(shirtSize) {
          scope.person.shirtSize = shirtSize;
        };

        scope.calculateAge = function() { // birthday is a date
          if (scope.person && scope.person.birthDate) {
            var ageDifMs = Date.now() - new Date(scope.person.birthDate).getTime();
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            scope.person.age = Math.abs(ageDate.getUTCFullYear() - 1970);
          }
        };

        scope.$watch('person.birthDate', function(newValue, oldValue) {
          scope.calculateAge();
        });

        scope.dateOptions = {
          showWeeks: false,
          startingDay: 0
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
          'Otro(a)'
        ];
        scope.setGrade = function(grade) {
          scope.person.grade = grade;
        };

      }
    };
  }
})();