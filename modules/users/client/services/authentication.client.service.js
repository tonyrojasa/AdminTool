(function () {
  'use strict';

  // Authentication service for user variables

  angular
    .module('users.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$window'];

  function Authentication($window) {
    var auth = {
      user: $window.user
    };

    auth.isUserAdmin = function () {
      auth = {
        user: $window.user
      }
      if (!auth.user) {
        return false;
      }
      return (auth.user && auth.user.roles && auth.user.roles.indexOf('admin') > -1);
    };

    auth.isGuestUser = function () {
      auth = {
        user: $window.user
      }
      if (!auth.user) {
        return true;
      }
      return (auth.user.roles && auth.user.roles.indexOf('guest') > -1);
    };

    auth.isBoardDirectorUser = function () {
      auth = {
        user: $window.user
      }
      if (!auth.user) {
        return false;
      }
      return (auth.user && auth.user.roles && auth.user.roles.indexOf('boardDirector') > -1);
    };

    auth.isBoardReviewerUser = function () {
      auth = {
        user: $window.user
      }
      if (!auth.user) {
        return false;
      }
      return (auth.user && auth.user.roles && auth.user.roles.indexOf('boardReviewer') > -1);
    };

    return auth;
  }
}());