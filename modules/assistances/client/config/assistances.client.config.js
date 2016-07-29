(function() {
  'use strict';

  angular
    .module('assistances')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Asistencias',
      state: 'assistances',
      type: 'dropdown',
      roles: ['admin', 'teacher', 'student', 'user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'assistances', {
      title: 'Lista de Asistencias',
      state: 'assistances.list',
      roles: ['admin', 'teacher', 'student', 'user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'assistances', {
      title: 'Crear Lista de Asistencia',
      state: 'assistances.create',
      roles: ['admin', 'teacher']
    });
  }
})();