(function() {
  'use strict';

  angular
    .module('moneycollections')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Inscripciones',
      state: 'moneycollections',
      type: 'dropdown',
      roles: ['admin', 'inscriptor', 'user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'moneycollections', {
      title: 'Inscripciones',
      state: 'moneycollections.list',
      roles: ['admin', 'inscriptor', 'user']
    });
    Menus.addSubMenuItem('topbar', 'moneycollections', {
      title: 'Reporte General',
      state: 'moneycollections.report',
      roles: ['admin', 'inscriptor', 'user']
    });
    Menus.addSubMenuItem('topbar', 'reports', {
      title: 'Inscripciones - Reporte General',
      state: 'moneycollections.report',
      roles: ['admin', 'inscriptor', 'user']
    });
    Menus.addSubMenuItem('topbar', 'moneycollections', {
      title: 'Reporte de Camisas',
      state: 'moneycollections.shirtsReport',
      roles: ['admin', 'inscriptor', 'user']
    });
    Menus.addSubMenuItem('topbar', 'reports', {
      title: 'Inscripciones - Reporte de Camisas',
      state: 'moneycollections.shirtsReport',
      roles: ['admin', 'inscriptor', 'user']
    });
  }
})();