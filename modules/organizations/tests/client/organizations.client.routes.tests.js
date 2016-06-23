(function () {
  'use strict';

  describe('Organizations Route Tests', function () {
    // Initialize global variables
    var $scope,
      OrganizationsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _OrganizationsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      OrganizationsService = _OrganizationsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('organizations');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/organizations');
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
          OrganizationsController,
          mockOrganization;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('organizations.view');
          $templateCache.put('modules/organizations/client/views/view-organization.client.view.html', '');

          // create mock Organization
          mockOrganization = new OrganizationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Organization Name'
          });

          //Initialize Controller
          OrganizationsController = $controller('OrganizationsController as vm', {
            $scope: $scope,
            organizationResolve: mockOrganization
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:organizationId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.organizationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            organizationId: 1
          })).toEqual('/organizations/1');
        }));

        it('should attach an Organization to the controller scope', function () {
          expect($scope.vm.organization._id).toBe(mockOrganization._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/organizations/client/views/view-organization.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          OrganizationsController,
          mockOrganization;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('organizations.create');
          $templateCache.put('modules/organizations/client/views/form-organization.client.view.html', '');

          // create mock Organization
          mockOrganization = new OrganizationsService();

          //Initialize Controller
          OrganizationsController = $controller('OrganizationsController as vm', {
            $scope: $scope,
            organizationResolve: mockOrganization
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.organizationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/organizations/create');
        }));

        it('should attach an Organization to the controller scope', function () {
          expect($scope.vm.organization._id).toBe(mockOrganization._id);
          expect($scope.vm.organization._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/organizations/client/views/form-organization.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          OrganizationsController,
          mockOrganization;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('organizations.edit');
          $templateCache.put('modules/organizations/client/views/form-organization.client.view.html', '');

          // create mock Organization
          mockOrganization = new OrganizationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Organization Name'
          });

          //Initialize Controller
          OrganizationsController = $controller('OrganizationsController as vm', {
            $scope: $scope,
            organizationResolve: mockOrganization
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:organizationId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.organizationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            organizationId: 1
          })).toEqual('/organizations/1/edit');
        }));

        it('should attach an Organization to the controller scope', function () {
          expect($scope.vm.organization._id).toBe(mockOrganization._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/organizations/client/views/form-organization.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
