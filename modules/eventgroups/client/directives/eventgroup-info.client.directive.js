(function() {
  'use strict';

  angular
    .module('people')
    .directive('eventgroupInfo', eventgroupInfo);

  function eventgroupInfo() {
    return {
      templateUrl: 'modules/eventgroups/client/views/eventgroup-info.client.view.html',
      restrict: 'E',
      replace: true,
      scope: {
        members: '=',
        leader: '=',
        assistant: '=',
        showContactInfo: '=',
        showHeaders: '=',
        report: '@'
      },
      link: function postLink(scope, element, attrs) {}
    };
  }
})();