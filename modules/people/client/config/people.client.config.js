(function () {
  'use strict';

  angular
    .module('people')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'People',
      state: 'people',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'people', {
      title: 'List People',
      state: 'people.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'people', {
      title: 'Create Person',
      state: 'people.create',
      roles: ['user']
    });
  }
})();
