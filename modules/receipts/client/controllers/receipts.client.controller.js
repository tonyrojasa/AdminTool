(function() {
  'use strict';

  // Receipts controller
  angular
    .module('receipts')
    .controller('ReceiptsController', ReceiptsController);

  ReceiptsController.$inject = ['$rootScope', '$scope', '$state', 'Authentication', 'receiptResolve', 'CurrentEventsService',
    'eventregistrationResolve', 'EventregistrationsService', 'CurrentEventregistrationsService', '$stateParams', 'Notification'
  ];

  function ReceiptsController($rootScope, $scope, $state, Authentication, receipt, CurrentEventsService, eventregistration,
    EventregistrationsService, CurrentEventregistrationsService, $stateParams, Notification) {
    var vm = this;

    vm.success = $stateParams.successMessage;
    if (vm.success) {
      Notification.info({
        title: 'Operación ejecutada exitosamente!',
        message: vm.success,
        delay: 15000
      });
    }

    vm.authentication = Authentication;
    vm.receipt = receipt;
    vm.eventregistration = eventregistration;
    vm.eventRegistrations = CurrentEventregistrationsService.query();
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.initReceipt = initReceipt;
    vm.onIsDebitClicked = onIsDebitClicked;
    vm.calculateBalanceDue = calculateBalanceDue;
    vm.showNonRegistrationEventsOnly = showNonRegistrationEventsOnly;

    function showNonRegistrationEventsOnly() {
      if ($state.current.name === 'receipts.createForNonRegistrationEvents') {
        return true;
      } else {
        return false;
      }
    }

    function onIsDebitClicked() {
      if (vm.receipt.isDebit && !vm.isEventRegistrationPayment) {
        vm.receipt.currentBalance = 0;
      }
      if (vm.receipt.paymentAmount) {
        vm.receipt.paymentAmount = vm.receipt.paymentAmount * -1;
      }
      calculateBalanceDue();
    }

    function calculateBalanceDue() {
      if (vm.receipt.isDebit && vm.receipt.paymentAmount > 0) {
        vm.receipt.paymentAmount = -vm.receipt.paymentAmount;
      }

      if (vm.receipt.isDebit && vm.receipt.currentBalance === 0) {
        vm.receipt.balanceDue = 0;
      } else {
        vm.receipt.balanceDue = vm.receipt.currentBalance - vm.receipt.paymentAmount;
      }
      return vm.receipt.balanceDue;
    }

    function initReceipt() {
      CurrentEventsService.query(function(events) {
        if (vm.showNonRegistrationEventsOnly()) {
          vm.receipt.paymentOf = 'Cancelación';
          vm.events = _.filter(events, function(o) {
            return o.nonRegistration === true;
          });
        } else {
          vm.events = _.filter(events, function(o) {
            return o.nonRegistration === false;
          });
        }
      });

      vm.paymentOfList = [
        'Abono',
        'Cancelación',
        'Devolución',
        'Ingreso - Ofrenda',
        'Gasto',
        'Otro'
      ];
      vm.paidByList = [
        'Efectivo',
        'Cheque',
        'Tarjeta',
        'Transferencia',
        'Otro'
      ];
      vm.receipt.paidBy = vm.receipt.paidBy ? vm.receipt.paidBy : 'Efectivo'; //default value
      //default to current user
      if (!vm.receipt.receivedBy) {
        vm.receipt.receivedBy = vm.authentication.user.displayName;
      }

      if (vm.receipt._id) {
        vm.eventregistration = receipt.eventRegistration;
        if (vm.eventregistration) {
          EventregistrationsService.get({
            eventregistrationId: receipt.eventRegistration._id
          }, function(data) {
            vm.eventregistration = data;
          });
        }
      }

      if (vm.isNewEventRegistration()) {
        vm.isEventRegistrationPayment = true;
        vm.receipt.event = vm.eventregistration.event;
        vm.receipt.receivedFrom = vm.eventregistration.person.firstName + ' ' +
          vm.eventregistration.person.lastName + ' ' + vm.eventregistration.person.secondLastName;
        vm.receipt.currentBalance = vm.eventregistration.balanceAmount;
      }

      if (vm.receipt.paymentDate) {
        vm.receipt.paymentDate = new Date(vm.receipt.paymentDate);
      } else {
        vm.receipt.paymentDate = new Date();

      }

      if (vm.eventregistration || vm.receipt.eventRegistration) {
        vm.isEventRegistrationPayment = true;
      } else {
        vm.isEventRegistrationPayment = false;
      }

      if (vm.receipt.eventRegistration) {
        vm.oldEventRegistration = vm.receipt.eventRegistration;
        vm.oldEventRegistration.balanceAmount += vm.receipt.paymentAmount;
      }
    }

    vm.pendingRegistrationsFilter = function(eventRegistration) {
      return eventRegistration.balanceAmount > 0;
    };

    vm.isNewEventRegistration = function() {
      return (vm.eventregistration && !vm.receipt.eventRegistration);
    };

    vm.isEventServerReceipt = function() {
      return (vm.receipt.eventRegistration && vm.receipt.eventRegistration.shirtsQuantity &&
        (vm.receipt.eventRegistration.isEventServer ||
          vm.receipt.eventRegistration.eventExternalServer.isEventExternalServer));
    };

    vm.setPaymentOf = function(paymentOf) {
      vm.receipt.paymentOf = paymentOf;
    };

    vm.setPaidBy = function(paidBy) {
      vm.receipt.paidBy = paidBy;
    };

    //set registration event
    vm.setEvent = function(event) {
      vm.receipt.event = event;
      if (vm.showNonRegistrationEventsOnly()) {
        vm.receipt.description = 'Venta de Tiquete - ' + event.name;
        vm.receipt.currentBalance = event.price;
        vm.receipt.paymentAmount = event.price;
        vm.calculateBalanceDue();
      }
    };

    vm.clearEvent = function() {
      vm.receipt.event = undefined;
      vm.person = undefined;
      if (vm.showNonRegistrationEventsOnly()) {
        vm.receipt.currentBalance = '';
        vm.receipt.paymentAmount = '';
      }
    }

    //set registration event
    vm.setEventRegistrationEvent = function(event) {
      vm.receipt.eventRegistration.event = event;
    };

    vm.setEventRegistration = function(eventRegistration) {
      vm.receipt.eventRegistration = eventRegistration;
      vm.receipt.event = eventRegistration.event;
      if (vm.oldEventRegistration) {
        if (vm.oldEventRegistration._id != eventRegistration._id) {
          vm.receipt.currentBalance = eventRegistration.balanceAmount;
          calculateBalanceDue();
          vm.newObservation = 'Este recibo, anteriormente aplicado a la inscripción #' +
            vm.oldEventRegistration.registrationNumber + ', se aplicó la inscripción #' + eventRegistration.registrationNumber;
        } else {
          vm.receipt.currentBalance = vm.oldEventRegistration.balanceAmount;
          calculateBalanceDue();
          vm.newObservation = null;
        }
      }
    };

    // Remove existing Receipt
    vm.remove = function(receipt) {
      if (confirm('Está seguro que desea eliminar el recibo # ' + receipt.receiptNumber + ' ?')) {
        var eventRegistrationSuccessMsg = '';
        receipt.$remove(function() {
          if (vm.isEventRegistrationReceipt(receipt)) {
            vm.updateEventRegistration(receipt);
            eventRegistrationSuccessMsg = 'Y se actualizó el saldo de la inscripción # ' + receipt.eventRegistration.registrationNumber;
          }
          vm.success = 'El recibo # ' + receipt.receiptNumber + '  ha sido eliminado. ' + eventRegistrationSuccessMsg + '.';

          Notification.info({
            title: 'Operación ejecutada exitosamente!',
            message: vm.success,
            delay: 15000
          });
          $state.go('receipts.list');
        });
      }
    };

    // Remove existing Receipt
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.receipt.$remove($state.go('receipts.list'));
      }
    }

    vm.updateEventRegistration = function(receipt) {
      receipt.eventRegistration.balanceAmount += receipt.paymentAmount;
      EventregistrationsService.update({
        eventregistrationId: receipt.eventRegistration._id
      }, receipt.eventRegistration);
    };

    vm.updateOldEventRegistration = function() {
      EventregistrationsService.update({
        eventregistrationId: vm.oldEventRegistration._id
      }, vm.oldEventRegistration);
    };

    vm.isEventRegistrationReceipt = function(receipt) {
      return receipt.eventRegistration !== undefined;
    };

    // Save EventRegistration (if null only save receipt)
    function saveEventRegistration() {
      if (vm.isEventRegistrationPayment) {
        vm.eventregistration.balanceAmount = vm.calculateBalanceDue();

        EventregistrationsService.update({
          eventregistrationId: vm.eventregistration._id
        }, vm.eventregistration, successCallback, errorCallback);

      } else {
        saveReceipt();
      }

      function successCallback(res) {
        $rootScope.showLoadingSpinner = false;
        vm.receipt.eventRegistration = res;
        saveReceipt();
      }

      function errorCallback(res) {
        $rootScope.showLoadingSpinner = false;
        vm.error = res.data.message;
      }
    }

    // Save Receipt
    function saveReceipt() {
      if (vm.receipt._id) {
        vm.receipt.$update(successCallback, errorCallback);
      } else {
        vm.receipt.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $rootScope.showLoadingSpinner = false;
        var message = 'Recibo # ' + res.receiptNumber + ' creado/actualizado correctamente.';
        $state.go('receipts.view', {
          receiptId: res._id,
          successMessage: message
        });
      }

      function errorCallback(res) {
        $rootScope.showLoadingSpinner = false;
        vm.error = res.data.message;
      }
    }

    // Save Receipt
    function save(isValid) {
      $rootScope.showLoadingSpinner = true;
      if (!isValid) {
        $rootScope.showLoadingSpinner = false;
        vm.error = 'Por favor completar los campos requeridos (*) y/o corregir los errores del formulario';
        $scope.$broadcast('show-errors-check-validity', 'vm.form.receiptForm');
        Notification.clearAll();
        Notification.error({
          message: vm.error,
          title: '<i class="glyphicon glyphicon-remove"></i> Error en el formulario!',
          delay: 6000,
          replaceMessage: true
        });
        return false;
      }
      if (vm.newObservation) {
        vm.updateOldEventRegistration();
        vm.receipt.observations.push(vm.newObservation);
      }
      saveEventRegistration();
    }

    vm.print = function(id) {
      var data = document.getElementById(id).innerHTML;
      var mywindow = window.open('', 'my div', 'height=600,width=600');
      mywindow.document.write('<html><head><title>Imprimir Recibo</title>');
      mywindow.document.write('</head><body >');
      mywindow.document.write(data);
      mywindow.document.write('</body></html>');

      mywindow.document.close(); // necessary for IE >= 10
      mywindow.focus(); // necessary for IE >= 10

      mywindow.print();
      mywindow.close();

      // return true;
      //window.print();
    };

    vm.initReceipt();
  }
})();