(function () {
  'use strict';

  describe('People List Controller Tests', function () {
    // Initialize global variables
    var PeopleListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      PeopleService,
      mockPerson;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _PeopleService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      PeopleService = _PeopleService_;

      // create mock article
      mockPerson = new PeopleService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Person Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the People List controller.
      PeopleListController = $controller('PeopleListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockPersonList;

      beforeEach(function () {
        mockPersonList = [mockPerson, mockPerson];
      });

      it('should send a GET request and return all People', inject(function (PeopleService) {
        // Set POST response
        $httpBackend.expectGET('api/people').respond(mockPersonList);

        // Ignore parent template get on state transition
        $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200, '');

        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.people.length).toEqual(2);
        expect($scope.vm.people[0]).toEqual(mockPerson);
        expect($scope.vm.people[1]).toEqual(mockPerson);

      }));
    });
  });
})();
