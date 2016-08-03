(function () {
  'use strict';

  describe('Assistances Route Tests', function () {
    // Initialize global variables
    var $scope,
      AssistancesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AssistancesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AssistancesService = _AssistancesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('assistances');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/assistances');
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
          AssistancesController,
          mockAssistance;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('assistances.view');
          $templateCache.put('modules/assistances/client/views/view-assistance.client.view.html', '');

          // create mock Assistance
          mockAssistance = new AssistancesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Assistance Name'
          });

          //Initialize Controller
          AssistancesController = $controller('AssistancesController as vm', {
            $scope: $scope,
            assistanceResolve: mockAssistance
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:assistanceId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.assistanceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            assistanceId: 1
          })).toEqual('/assistances/1');
        }));

        it('should attach an Assistance to the controller scope', function () {
          expect($scope.vm.assistance._id).toBe(mockAssistance._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/assistances/client/views/view-assistance.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AssistancesController,
          mockAssistance;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('assistances.create');
          $templateCache.put('modules/assistances/client/views/form-assistance.client.view.html', '');

          // create mock Assistance
          mockAssistance = new AssistancesService();

          //Initialize Controller
          AssistancesController = $controller('AssistancesController as vm', {
            $scope: $scope,
            assistanceResolve: mockAssistance
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.assistanceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/assistances/create');
        }));

        it('should attach an Assistance to the controller scope', function () {
          expect($scope.vm.assistance._id).toBe(mockAssistance._id);
          expect($scope.vm.assistance._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/assistances/client/views/form-assistance.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AssistancesController,
          mockAssistance;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('assistances.edit');
          $templateCache.put('modules/assistances/client/views/form-assistance.client.view.html', '');

          // create mock Assistance
          mockAssistance = new AssistancesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Assistance Name'
          });

          //Initialize Controller
          AssistancesController = $controller('AssistancesController as vm', {
            $scope: $scope,
            assistanceResolve: mockAssistance
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:assistanceId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.assistanceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            assistanceId: 1
          })).toEqual('/assistances/1/edit');
        }));

        it('should attach an Assistance to the controller scope', function () {
          expect($scope.vm.assistance._id).toBe(mockAssistance._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/assistances/client/views/form-assistance.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
