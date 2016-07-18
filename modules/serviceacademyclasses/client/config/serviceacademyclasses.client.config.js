(function() {
  'use strict';

  angular
    .module('serviceacademyclasses')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Academias',
      state: 'serviceacademyclasses',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'serviceacademyclasses', {
      title: 'Lista de Academias',
      state: 'serviceacademyclasses.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'serviceacademyclasses', {
      title: 'Crear Academia',
      state: 'serviceacademyclasses.create',
      roles: ['user', 'admin']
    });
  }
})();