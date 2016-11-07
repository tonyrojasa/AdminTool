(function() {
  'use strict';

  angular
    .module('eventgroups')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Eventgroups',
      state: 'eventgroups',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'eventgroups', {
      title: 'List Eventgroups',
      state: 'eventgroups.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'eventgroups', {
      title: 'Create Eventgroup',
      state: 'eventgroups.create',
      roles: ['user']
    });
  }
})();