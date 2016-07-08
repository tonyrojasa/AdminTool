(function() {
  'use strict';

  angular
    .module('people')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'maintenance', {
      title: 'Personas',
      state: 'people.list'
    });
  }
})();