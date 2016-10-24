(function() {
  'use strict';

  angular
    .module('receipts')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Recibos',
      state: 'receipts',
      type: 'dropdown',
      roles: ['admin', 'inscriptor', 'user', 'accountant']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'receipts', {
      title: 'Lista de Recibos',
      state: 'receipts.list',
      roles: ['admin', 'inscriptor', 'user', 'accountant']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'receipts', {
      title: 'Crear Recibo',
      state: 'receipts.create',
      roles: ['admin', 'accountant']
    });

    Menus.addSubMenuItem('topbar', 'receipts', {
      title: 'Reporte General',
      state: 'receipts.report',
      roles: ['admin', 'inscriptor', 'user', 'accountant']
    });

    Menus.addSubMenuItem('topbar', 'reports', {
      title: 'Recibos - Reporte General',
      state: 'receipts.report',
      roles: ['admin', 'inscriptor', 'user', 'accountant']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'eventregistrations', {
      title: 'Recibos',
      state: 'receipts.list',
      roles: ['admin', 'accountant']
    });
  }
})();