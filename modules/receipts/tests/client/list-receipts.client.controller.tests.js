(function () {
  'use strict';

  describe('Receipts List Controller Tests', function () {
    // Initialize global variables
    var ReceiptsListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ReceiptsService,
      mockReceipt;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ReceiptsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ReceiptsService = _ReceiptsService_;

      // create mock article
      mockReceipt = new ReceiptsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Receipt Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Receipts List controller.
      ReceiptsListController = $controller('ReceiptsListController as vm', {
        $scope: $scope
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockReceiptList;

      beforeEach(function () {
        mockReceiptList = [mockReceipt, mockReceipt];
      });

      it('should send a GET request and return all Receipts', inject(function (ReceiptsService) {
        // Set POST response
        $httpBackend.expectGET('api/receipts').respond(mockReceiptList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.receipts.length).toEqual(2);
        expect($scope.vm.receipts[0]).toEqual(mockReceipt);
        expect($scope.vm.receipts[1]).toEqual(mockReceipt);

      }));
    });
  });
})();
