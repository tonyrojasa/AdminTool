(function() {
  'use strict';

  angular
    .module('people')
    .controller('PeopleListController', PeopleListController);

  PeopleListController.$inject = ['$anchorScroll', 'PeopleService', 'PersontypesService', 'ServiceareasService', 'Authentication',
    'EventregistrationsByPersonService', 'ServiceacademyclassesByPersonService', 'StudentsByPersonService'
  ];

  function PeopleListController($anchorScroll, PeopleService, PersontypesService, ServiceareasService, Authentication,
    EventregistrationsByPersonService, ServiceacademyclassesByPersonService, StudentsByPersonService) {
    var vm = this;
    vm.people = PeopleService.query();
    vm.authentication = Authentication;
    vm.remove = remove;
    vm.eventregistrationsByPersonService = EventregistrationsByPersonService;
    vm.serviceacademyclassesByPersonService = ServiceacademyclassesByPersonService;
    vm.studentsByPersonService = StudentsByPersonService;
    vm.personTypes = PersontypesService.query();
    vm.setPersonType = setPersonType;
    //set personTypes
    function setPersonType(personType) {
      vm.personType = personType;
    }

    vm.serviceAreas = ServiceareasService.query();
    vm.setServiceArea = setServiceArea;
    //set serviceAreas
    function setServiceArea(serviceArea) {
      vm.serviceArea = serviceArea;
    }

    vm.getServiceAreaNames = getServiceAreaNames;

    function getServiceAreaNames(serviceAreaArray) {
      if (serviceAreaArray && serviceAreaArray.length > 0) {
        var parsedServiceAreasArray = [];
        for (var index in serviceAreaArray) {
          if (serviceAreaArray[index].name) {
            parsedServiceAreasArray.push(serviceAreaArray[index].name);
          }
        }
        return parsedServiceAreasArray.join(', ');
      }
    }

    // Remove existing Eventregistration
    //Check if person exists on Students, ServiceAcademyClasses and EventRegistrations
    function remove(person) {
      var selectedPersonName = person.firstName + ' ' + person.lastName + ' ' + person.secondLastName;
      if (confirm('Está seguro que desea eliminar la persona: ' + selectedPersonName + ' ?')) {
        vm.eventregistrationsByPersonService.query({
          'personId': person._id
        }, function(data) {
          var isInEventRegistrations = (data.length > 0);
          vm.serviceacademyclassesByPersonService.query({
            'personId': person._id
          }, function(data) {
            var isInServiceAcademyClass = (data.length > 0);
            vm.studentsByPersonService.query({
              'personId': person._id
            }, function(data) {
              var isInStudents = (data.length > 0);
              if (isInEventRegistrations || isInServiceAcademyClass || isInStudents) {
                vm.error = 'No se puede eliminar la persona con el nombre de ' +
                  selectedPersonName + ' debido a que está siendo utilizada en otros modulos.';
                $anchorScroll(document.body.scrollTop);
              } else {
                person.$remove(function() {
                  vm.success = 'Se eliminó la persona con el nombre: ' + selectedPersonName;
                  vm.people = PeopleService.query();
                  $anchorScroll(document.body.scrollTop);
                });
              }
            });
          });
        });
      }
    }
  }
})();