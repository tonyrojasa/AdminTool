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
      roles: ['admin', 'inscriptor']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'receipts', {
      title: 'Lista de Recibos',
      state: 'receipts.list',
      roles: ['admin', 'inscriptor']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'receipts', {
      title: 'Crear Recibo',
      state: 'receipts.create',
      roles: ['admin', 'inscriptor']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'eventregistrations', {
      title: 'Recibos',
      state: 'receipts.list',
      roles: ['admin', 'inscriptor']
    });
  }
})();