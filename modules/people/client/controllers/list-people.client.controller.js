(function() {
  'use strict';

  angular
    .module('people')
    .controller('PeopleListController', PeopleListController);

  PeopleListController.$inject = ['$anchorScroll', 'PeopleService', 'PersontypesService', 'ServiceareasService', 'Authentication',
    'EventregistrationsByPersonService', 'ServiceacademyclassesByPersonService', 'StudentsByPersonService', 'NgTableParams'
  ];

  function PeopleListController($anchorScroll, PeopleService, PersontypesService, ServiceareasService, Authentication,
    EventregistrationsByPersonService, ServiceacademyclassesByPersonService, StudentsByPersonService, NgTableParams) {
    var vm = this;
    vm.personTypesFilterArray = [];
    vm.serviceAreasFilterArray = [];
    vm.getPeople = function() {
      return PeopleService.query(function(data) {
        _.each(data, function(person) {
          person.serviceAreas = vm.getServiceAreaNames(person.serviceArea);
        });
      });
    };
    vm.people = vm.getPeople();
    vm.authentication = Authentication;
    vm.remove = remove;
    vm.eventregistrationsByPersonService = EventregistrationsByPersonService;
    vm.serviceacademyclassesByPersonService = ServiceacademyclassesByPersonService;
    vm.studentsByPersonService = StudentsByPersonService;

    PersontypesService.query(function(data) {
      _.each(data, function(personType) {
        vm.personTypesFilterArray.push({
          id: personType.name,
          title: personType.name
        });
      });
    });

    ServiceareasService.query(function(data) {
      _.each(data, function(serviceArea) {
        vm.serviceAreasFilterArray.push({
          id: serviceArea.name,
          title: serviceArea.name
        });
      });
    });

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

    vm.isCollapsed = true;

    vm.tableParams = new NgTableParams({
      page: 1,
      count: 10
    }, {
      dataset: vm.people
    });

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
                vm.error = 'No se puede eliminar la persona con el nombre ' +
                  selectedPersonName + ' debido a que está siendo utilizada en otros modulos.';
                $anchorScroll(document.body.scrollTop);
              } else {
                person.$remove(function() {
                  vm.success = 'Se eliminó la persona con el nombre: ' + selectedPersonName;
                  vm.people = vm.getPeople();
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