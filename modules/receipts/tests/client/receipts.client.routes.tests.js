(function () {
  'use strict';

  describe('Receipts Route Tests', function () {
    // Initialize global variables
    var $scope,
      ReceiptsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ReceiptsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ReceiptsService = _ReceiptsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('receipts');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/receipts');
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
          ReceiptsController,
          mockReceipt;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('receipts.view');
          $templateCache.put('modules/receipts/client/views/view-receipt.client.view.html', '');

          // create mock Receipt
          mockReceipt = new ReceiptsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Receipt Name'
          });

          //Initialize Controller
          ReceiptsController = $controller('ReceiptsController as vm', {
            $scope: $scope,
            receiptResolve: mockReceipt
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:receiptId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.receiptResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            receiptId: 1
          })).toEqual('/receipts/1');
        }));

        it('should attach an Receipt to the controller scope', function () {
          expect($scope.vm.receipt._id).toBe(mockReceipt._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/receipts/client/views/view-receipt.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ReceiptsController,
          mockReceipt;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('receipts.create');
          $templateCache.put('modules/receipts/client/views/form-receipt.client.view.html', '');

          // create mock Receipt
          mockReceipt = new ReceiptsService();

          //Initialize Controller
          ReceiptsController = $controller('ReceiptsController as vm', {
            $scope: $scope,
            receiptResolve: mockReceipt
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.receiptResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/receipts/create');
        }));

        it('should attach an Receipt to the controller scope', function () {
          expect($scope.vm.receipt._id).toBe(mockReceipt._id);
          expect($scope.vm.receipt._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/receipts/client/views/form-receipt.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ReceiptsController,
          mockReceipt;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('receipts.edit');
          $templateCache.put('modules/receipts/client/views/form-receipt.client.view.html', '');

          // create mock Receipt
          mockReceipt = new ReceiptsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Receipt Name'
          });

          //Initialize Controller
          ReceiptsController = $controller('ReceiptsController as vm', {
            $scope: $scope,
            receiptResolve: mockReceipt
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:receiptId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.receiptResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            receiptId: 1
          })).toEqual('/receipts/1/edit');
        }));

        it('should attach an Receipt to the controller scope', function () {
          expect($scope.vm.receipt._id).toBe(mockReceipt._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/receipts/client/views/form-receipt.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
