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
      roles: ['admin', 'teacher', 'student', 'user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'serviceacademyclasses', {
      title: 'Lista de Academias',
      state: 'serviceacademyclasses.list',
      roles: ['admin', 'teacher', 'student', 'user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'serviceacademyclasses', {
      title: 'Crear Academia',
      state: 'serviceacademyclasses.create',
      roles: ['admin', 'teacher', 'student']
    });

    // Set top bar menu items
    Menus.addSubMenuItem('topbar', 'serviceacademyclasses', {
      title: 'Lista de Asistencias',
      state: 'assistances.list',
      roles: ['admin', 'teacher', 'student', 'user']
    });
  }
})();