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
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'receipts', {
      title: 'Lista',
      state: 'receipts.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'receipts', {
      title: 'Crear',
      state: 'receipts.create',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'eventregistrations', {
      title: 'Recibos',
      state: 'receipts.list'
    });
  }
})();