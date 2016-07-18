(function () {
  'use strict';

  describe('Serviceacademyclasses Route Tests', function () {
    // Initialize global variables
    var $scope,
      ServiceacademyclassesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ServiceacademyclassesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ServiceacademyclassesService = _ServiceacademyclassesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('serviceacademyclasses');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/serviceacademyclasses');
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
          ServiceacademyclassesController,
          mockServiceacademyclass;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('serviceacademyclasses.view');
          $templateCache.put('modules/serviceacademyclasses/client/views/view-serviceacademyclass.client.view.html', '');

          // create mock Serviceacademyclass
          mockServiceacademyclass = new ServiceacademyclassesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Serviceacademyclass Name'
          });

          //Initialize Controller
          ServiceacademyclassesController = $controller('ServiceacademyclassesController as vm', {
            $scope: $scope,
            serviceacademyclassResolve: mockServiceacademyclass
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:serviceacademyclassId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.serviceacademyclassResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            serviceacademyclassId: 1
          })).toEqual('/serviceacademyclasses/1');
        }));

        it('should attach an Serviceacademyclass to the controller scope', function () {
          expect($scope.vm.serviceacademyclass._id).toBe(mockServiceacademyclass._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/serviceacademyclasses/client/views/view-serviceacademyclass.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ServiceacademyclassesController,
          mockServiceacademyclass;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('serviceacademyclasses.create');
          $templateCache.put('modules/serviceacademyclasses/client/views/form-serviceacademyclass.client.view.html', '');

          // create mock Serviceacademyclass
          mockServiceacademyclass = new ServiceacademyclassesService();

          //Initialize Controller
          ServiceacademyclassesController = $controller('ServiceacademyclassesController as vm', {
            $scope: $scope,
            serviceacademyclassResolve: mockServiceacademyclass
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.serviceacademyclassResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/serviceacademyclasses/create');
        }));

        it('should attach an Serviceacademyclass to the controller scope', function () {
          expect($scope.vm.serviceacademyclass._id).toBe(mockServiceacademyclass._id);
          expect($scope.vm.serviceacademyclass._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/serviceacademyclasses/client/views/form-serviceacademyclass.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ServiceacademyclassesController,
          mockServiceacademyclass;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('serviceacademyclasses.edit');
          $templateCache.put('modules/serviceacademyclasses/client/views/form-serviceacademyclass.client.view.html', '');

          // create mock Serviceacademyclass
          mockServiceacademyclass = new ServiceacademyclassesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Serviceacademyclass Name'
          });

          //Initialize Controller
          ServiceacademyclassesController = $controller('ServiceacademyclassesController as vm', {
            $scope: $scope,
            serviceacademyclassResolve: mockServiceacademyclass
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:serviceacademyclassId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.serviceacademyclassResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            serviceacademyclassId: 1
          })).toEqual('/serviceacademyclasses/1/edit');
        }));

        it('should attach an Serviceacademyclass to the controller scope', function () {
          expect($scope.vm.serviceacademyclass._id).toBe(mockServiceacademyclass._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/serviceacademyclasses/client/views/form-serviceacademyclass.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
