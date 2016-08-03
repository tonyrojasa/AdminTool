(function() {
  'use strict';

  angular
    .module('people')
    .controller('PeopleListController', PeopleListController);

  PeopleListController.$inject = ['PeopleService', 'PersontypesService', 'ServiceareasService'];

  function PeopleListController(PeopleService, PersontypesService, ServiceareasService) {
    var vm = this;
    vm.people = PeopleService.query();

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
  }
})();