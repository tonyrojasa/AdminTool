(function() {
  'use strict';

  describe('People Route Tests', function() {
    // Initialize global variables
    var $scope,
      PeopleService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function($rootScope, _PeopleService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PeopleService = _PeopleService_;
    }));

    describe('Route Config', function() {
      describe('Main Route', function() {
        var mainstate;
        beforeEach(inject(function($state) {
          mainstate = $state.get('people');
        }));

        it('Should have the correct URL', function() {
          expect(mainstate.url).toEqual('/people');
        });

        it('Should be abstract', function() {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function() {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function() {
        var viewstate,
          PeopleController,
          mockPerson;

        beforeEach(inject(function($controller, $state, $templateCache) {
          viewstate = $state.get('people.view');
          $templateCache.put('modules/people/client/views/view-person.client.view.html', '');

          // create mock Person
          mockPerson = new PeopleService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Person Name'
          });

          // Initialize Controller
          PeopleController = $controller('PeopleController as vm', {
            $scope: $scope,
            personResolve: mockPerson
          });
        }));

        it('Should have the correct URL', function() {
          expect(viewstate.url).toEqual('/:personId');
        });

        it('Should have a resolve function', function() {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.personResolve).toEqual('function');
        });

        it('should respond to URL', inject(function($state) {
          expect($state.href(viewstate, {
            personId: 1
          })).toEqual('/people/1');
        }));

        it('should attach an Person to the controller scope', function() {
          expect($scope.vm.person._id).toBe(mockPerson._id);
        });

        it('Should not be abstract', function() {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function() {
          expect(viewstate.templateUrl).toBe('modules/people/client/views/view-person.client.view.html');
        });
      });

      describe('Create Route', function() {
        var createstate,
          PeopleController,
          mockPerson;

        beforeEach(inject(function($controller, $state, $templateCache) {
          createstate = $state.get('people.create');
          $templateCache.put('modules/people/client/views/form-person.client.view.html', '');

          // create mock Person
          mockPerson = new PeopleService();

          // Initialize Controller
          PeopleController = $controller('PeopleController as vm', {
            $scope: $scope,
            personResolve: mockPerson
          });
        }));

        it('Should have the correct URL', function() {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function() {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.personResolve).toEqual('function');
        });

        it('should respond to URL', inject(function($state) {
          expect($state.href(createstate)).toEqual('/people/create');
        }));

        it('should attach an Person to the controller scope', function() {
          expect($scope.vm.person._id).toBe(mockPerson._id);
          expect($scope.vm.person._id).toBe(undefined);
        });

        it('Should not be abstract', function() {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function() {
          expect(createstate.templateUrl).toBe('modules/people/client/views/form-person.client.view.html');
        });
      });

      describe('Edit Route', function() {
        var editstate,
          PeopleController,
          mockPerson;

        beforeEach(inject(function($controller, $state, $templateCache) {
          editstate = $state.get('people.edit');
          $templateCache.put('modules/people/client/views/form-person.client.view.html', '');

          // create mock Person
          mockPerson = new PeopleService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Person Name'
          });

          // Initialize Controller
          PeopleController = $controller('PeopleController as vm', {
            $scope: $scope,
            personResolve: mockPerson
          });
        }));

        it('Should have the correct URL', function() {
          expect(editstate.url).toEqual('/:personId/edit');
        });

        it('Should have a resolve function', function() {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.personResolve).toEqual('function');
        });

        it('should respond to URL', inject(function($state) {
          expect($state.href(editstate, {
            personId: 1
          })).toEqual('/people/1/edit');
        }));

        it('should attach an Person to the controller scope', function() {
          expect($scope.vm.person._id).toBe(mockPerson._id);
        });

        it('Should not be abstract', function() {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function() {
          expect(editstate.templateUrl).toBe('modules/people/client/views/form-person.client.view.html');
        });

        xit('Should go to unauthorized route', function() {

        });
      });

    });
  });
})();