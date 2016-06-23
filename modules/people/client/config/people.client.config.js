(function () {
  'use strict';

  angular
    .module('people')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Personas',
      state: 'people',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'people', {
      title: 'Lista de Personas',
      state: 'people.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'people', {
      title: 'Crear Persona',
      state: 'people.create',
      roles: ['user']
    });
  }
})();
