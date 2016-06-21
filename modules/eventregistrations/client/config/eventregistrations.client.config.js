(function () {
  'use strict';

  angular
    .module('eventregistrations')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Eventregistrations',
      state: 'eventregistrations',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'eventregistrations', {
      title: 'List Eventregistrations',
      state: 'eventregistrations.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'eventregistrations', {
      title: 'Create Eventregistration',
      state: 'eventregistrations.create',
      roles: ['user']
    });
  }
})();
