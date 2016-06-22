(function () {
  'use strict';

  angular
    .module('eventregistrations')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Inscripciones',
      state: 'eventregistrations',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'eventregistrations', {
      title: 'Registros de eventos',
      state: 'eventregistrations.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'eventregistrations', {
      title: 'Crear Inscripcion',
      state: 'eventregistrations.create',
      roles: ['user']
    });
  }
})();
