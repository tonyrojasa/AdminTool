(function () {
  'use strict';

  angular
    .module('organizations')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Organizations',
      state: 'organizations',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'organizations', {
      title: 'List Organizations',
      state: 'organizations.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'organizations', {
      title: 'Create Organization',
      state: 'organizations.create',
      roles: ['user']
    });
  }
})();
