(function () {
  'use strict';

  angular
    .module('moneycollections')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Flujos de dinero',
      state: 'moneycollections',
      type: 'dropdown',
      roles: ['boardDirector', 'boardReviewer']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'moneycollections', {
      title: 'Flujos de dinero',
      state: 'moneycollections.list',
      roles: ['boardDirector', 'boardReviewer']
    });
    Menus.addSubMenuItem('topbar', 'moneycollections', {
      title: 'Nuevo flujos de dinero',
      state: 'moneycollections.create',
      roles: ['boardDirector']
    });
    Menus.addSubMenuItem('topbar', 'moneycollections', {
      title: 'Reporte General',
      state: 'moneycollections.report',
      roles: ['boardDirector', 'boardReviewer']
    });
    Menus.addSubMenuItem('topbar', 'reports', {
      title: 'Flujos de dinero - Reporte General',
      state: 'moneycollections.report',
      roles: ['boardDirector', 'boardReviewer']
    });
  }
})();