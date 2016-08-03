(function() {
  'use strict';

  angular
    .module('eventregistrations')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Inscripciones',
      state: 'eventregistrations',
      type: 'dropdown',
      roles: ['admin', 'inscriptor', 'user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'eventregistrations', {
      title: 'Inscripciones',
      state: 'eventregistrations.list',
      roles: ['admin', 'inscriptor', 'user']
    });
  }
})();