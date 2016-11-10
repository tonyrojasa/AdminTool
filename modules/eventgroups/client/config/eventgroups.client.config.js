(function() {
  'use strict';

  angular
    .module('eventgroups')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {

  }
})();