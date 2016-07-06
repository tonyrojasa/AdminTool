(function () {
  'use strict';

  angular
    .module('people')
    .directive('personForm', personForm);

  personForm.$inject = ['$rootScope', 'OrganizationsService'];

  function personForm($rootScope, OrganizationsService) {
    return {
      templateUrl: 'modules/people/client/views/person-form.client.view.html',
      restrict: 'E',
      scope: {
        person: '=',
        form: '='
      },
      link: function postLink(scope, element, attrs) {     
        if(scope.person._id){    
          OrganizationsService.query({ id: scope.person.organization },function(data){
            scope.selectedOrganizationName = data[0].name;
          });
        }

        scope.organizations = OrganizationsService.query();        
        scope.setOrganization = function (organization) {
          scope.person.organization = organization;
          scope.selectedOrganizationName = organization.name;
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

      }
    };
  }
})();
