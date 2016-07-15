(function () {
  'use strict';

  describe('Persontypes Route Tests', function () {
    // Initialize global variables
    var $scope,
      PersontypesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PersontypesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PersontypesService = _PersontypesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('persontypes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/persontypes');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          PersontypesController,
          mockPersontype;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('persontypes.view');
          $templateCache.put('modules/persontypes/client/views/view-persontype.client.view.html', '');

          // create mock Persontype
          mockPersontype = new PersontypesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Persontype Name'
          });

          //Initialize Controller
          PersontypesController = $controller('PersontypesController as vm', {
            $scope: $scope,
            persontypeResolve: mockPersontype
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:persontypeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.persontypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            persontypeId: 1
          })).toEqual('/persontypes/1');
        }));

        it('should attach an Persontype to the controller scope', function () {
          expect($scope.vm.persontype._id).toBe(mockPersontype._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/persontypes/client/views/view-persontype.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PersontypesController,
          mockPersontype;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('persontypes.create');
          $templateCache.put('modules/persontypes/client/views/form-persontype.client.view.html', '');

          // create mock Persontype
          mockPersontype = new PersontypesService();

          //Initialize Controller
          PersontypesController = $controller('PersontypesController as vm', {
            $scope: $scope,
            persontypeResolve: mockPersontype
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.persontypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/persontypes/create');
        }));

        it('should attach an Persontype to the controller scope', function () {
          expect($scope.vm.persontype._id).toBe(mockPersontype._id);
          expect($scope.vm.persontype._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/persontypes/client/views/form-persontype.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PersontypesController,
          mockPersontype;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('persontypes.edit');
          $templateCache.put('modules/persontypes/client/views/form-persontype.client.view.html', '');

          // create mock Persontype
          mockPersontype = new PersontypesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Persontype Name'
          });

          //Initialize Controller
          PersontypesController = $controller('PersontypesController as vm', {
            $scope: $scope,
            persontypeResolve: mockPersontype
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:persontypeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.persontypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            persontypeId: 1
          })).toEqual('/persontypes/1/edit');
        }));

        it('should attach an Persontype to the controller scope', function () {
          expect($scope.vm.persontype._id).toBe(mockPersontype._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/persontypes/client/views/form-persontype.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
