(function () {
  'use strict';

  angular
    .module('eventpeoplegroups')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Eventpeoplegroups',
      state: 'eventpeoplegroups',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'eventpeoplegroups', {
      title: 'List Eventpeoplegroups',
      state: 'eventpeoplegroups.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'eventpeoplegroups', {
      title: 'Create Eventpeoplegroup',
      state: 'eventpeoplegroups.create',
      roles: ['user']
    });
  }
})();
