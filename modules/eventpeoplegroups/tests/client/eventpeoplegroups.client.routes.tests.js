(function () {
  'use strict';

  describe('Eventpeoplegroups Route Tests', function () {
    // Initialize global variables
    var $scope,
      EventpeoplegroupsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _EventpeoplegroupsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      EventpeoplegroupsService = _EventpeoplegroupsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('eventpeoplegroups');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/eventpeoplegroups');
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
          EventpeoplegroupsController,
          mockEventpeoplegroup;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('eventpeoplegroups.view');
          $templateCache.put('modules/eventpeoplegroups/client/views/view-eventpeoplegroup.client.view.html', '');

          // create mock Eventpeoplegroup
          mockEventpeoplegroup = new EventpeoplegroupsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Eventpeoplegroup Name'
          });

          //Initialize Controller
          EventpeoplegroupsController = $controller('EventpeoplegroupsController as vm', {
            $scope: $scope,
            eventpeoplegroupResolve: mockEventpeoplegroup
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:eventpeoplegroupId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.eventpeoplegroupResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            eventpeoplegroupId: 1
          })).toEqual('/eventpeoplegroups/1');
        }));

        it('should attach an Eventpeoplegroup to the controller scope', function () {
          expect($scope.vm.eventpeoplegroup._id).toBe(mockEventpeoplegroup._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/eventpeoplegroups/client/views/view-eventpeoplegroup.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          EventpeoplegroupsController,
          mockEventpeoplegroup;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('eventpeoplegroups.create');
          $templateCache.put('modules/eventpeoplegroups/client/views/form-eventpeoplegroup.client.view.html', '');

          // create mock Eventpeoplegroup
          mockEventpeoplegroup = new EventpeoplegroupsService();

          //Initialize Controller
          EventpeoplegroupsController = $controller('EventpeoplegroupsController as vm', {
            $scope: $scope,
            eventpeoplegroupResolve: mockEventpeoplegroup
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.eventpeoplegroupResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/eventpeoplegroups/create');
        }));

        it('should attach an Eventpeoplegroup to the controller scope', function () {
          expect($scope.vm.eventpeoplegroup._id).toBe(mockEventpeoplegroup._id);
          expect($scope.vm.eventpeoplegroup._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/eventpeoplegroups/client/views/form-eventpeoplegroup.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          EventpeoplegroupsController,
          mockEventpeoplegroup;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('eventpeoplegroups.edit');
          $templateCache.put('modules/eventpeoplegroups/client/views/form-eventpeoplegroup.client.view.html', '');

          // create mock Eventpeoplegroup
          mockEventpeoplegroup = new EventpeoplegroupsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Eventpeoplegroup Name'
          });

          //Initialize Controller
          EventpeoplegroupsController = $controller('EventpeoplegroupsController as vm', {
            $scope: $scope,
            eventpeoplegroupResolve: mockEventpeoplegroup
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:eventpeoplegroupId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.eventpeoplegroupResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            eventpeoplegroupId: 1
          })).toEqual('/eventpeoplegroups/1/edit');
        }));

        it('should attach an Eventpeoplegroup to the controller scope', function () {
          expect($scope.vm.eventpeoplegroup._id).toBe(mockEventpeoplegroup._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/eventpeoplegroups/client/views/form-eventpeoplegroup.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
