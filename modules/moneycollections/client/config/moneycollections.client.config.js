(function() {
  'use strict';

  angular
    .module('moneycollections')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Diezmos/Ofrendas',
      state: 'moneycollections',
      type: 'dropdown',
      roles: ['boardDirector']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'moneycollections', {
      title: 'Diezmos/Ofrendas',
      state: 'moneycollections.list',
      roles: ['boardDirector', 'boardReviewer']
    });
    Menus.addSubMenuItem('topbar', 'moneycollections', {
      title: 'Reporte General',
      state: 'moneycollections.report',
      roles: ['boardDirector', 'boardReviewer']
    });
    Menus.addSubMenuItem('topbar', 'reports', {
      title: 'Diezmos/Ofrendas - Reporte General',
      state: 'moneycollections.report',
      roles: ['boardDirector', 'boardReviewer']
    });
  }
})();