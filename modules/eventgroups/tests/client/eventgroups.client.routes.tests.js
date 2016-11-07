(function () {
  'use strict';

  describe('Eventgroups Route Tests', function () {
    // Initialize global variables
    var $scope,
      EventgroupsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _EventgroupsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      EventgroupsService = _EventgroupsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('eventgroups');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/eventgroups');
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
          EventgroupsController,
          mockEventgroup;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('eventgroups.view');
          $templateCache.put('modules/eventgroups/client/views/view-eventgroup.client.view.html', '');

          // create mock Eventgroup
          mockEventgroup = new EventgroupsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Eventgroup Name'
          });

          //Initialize Controller
          EventgroupsController = $controller('EventgroupsController as vm', {
            $scope: $scope,
            eventgroupResolve: mockEventgroup
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:eventgroupId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.eventgroupResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            eventgroupId: 1
          })).toEqual('/eventgroups/1');
        }));

        it('should attach an Eventgroup to the controller scope', function () {
          expect($scope.vm.eventgroup._id).toBe(mockEventgroup._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/eventgroups/client/views/view-eventgroup.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          EventgroupsController,
          mockEventgroup;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('eventgroups.create');
          $templateCache.put('modules/eventgroups/client/views/form-eventgroup.client.view.html', '');

          // create mock Eventgroup
          mockEventgroup = new EventgroupsService();

          //Initialize Controller
          EventgroupsController = $controller('EventgroupsController as vm', {
            $scope: $scope,
            eventgroupResolve: mockEventgroup
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.eventgroupResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/eventgroups/create');
        }));

        it('should attach an Eventgroup to the controller scope', function () {
          expect($scope.vm.eventgroup._id).toBe(mockEventgroup._id);
          expect($scope.vm.eventgroup._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/eventgroups/client/views/form-eventgroup.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          EventgroupsController,
          mockEventgroup;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('eventgroups.edit');
          $templateCache.put('modules/eventgroups/client/views/form-eventgroup.client.view.html', '');

          // create mock Eventgroup
          mockEventgroup = new EventgroupsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Eventgroup Name'
          });

          //Initialize Controller
          EventgroupsController = $controller('EventgroupsController as vm', {
            $scope: $scope,
            eventgroupResolve: mockEventgroup
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:eventgroupId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.eventgroupResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            eventgroupId: 1
          })).toEqual('/eventgroups/1/edit');
        }));

        it('should attach an Eventgroup to the controller scope', function () {
          expect($scope.vm.eventgroup._id).toBe(mockEventgroup._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/eventgroups/client/views/form-eventgroup.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
