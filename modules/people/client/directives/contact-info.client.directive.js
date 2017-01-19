(function() {
  'use strict';

  angular
    .module('people')
    .directive('contactInfo', contactInfo);

  function contactInfo() {
    return {
      templateUrl: 'modules/people/client/views/contact-info.client.view.html',
      restrict: 'E',
      replace: true,
      scope: {
        contacts: '=',
        form: '=',
        readonly: '@',
        report: '@',
        showHeaders: '='
      },
      link: function postLink(scope, element, attrs) {

        scope.addContact = function() {
          if (!scope.contacts) {
            scope.contacts = [];
          }
          scope.contacts.push({
            personName: '',
            phoneNumber: '',
            homeAddress: '',
            relationship: 'Familiar'
          });
        };

        scope.removeContact = function(index) {
          scope.contacts.splice(index, 1);
        };

      }
    };
  }
})();