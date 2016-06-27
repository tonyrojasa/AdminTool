(function () {
  'use strict';

  angular
    .module('events')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Eventos',
      state: 'events',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'events', {
      title: 'Lista de Eventos',
      state: 'events.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'events', {
      title: 'Crear Evento',
      state: 'events.create',
      roles: ['user']
    });
  }
})();
