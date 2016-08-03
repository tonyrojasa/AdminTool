(function() {
  'use strict';

  angular
    .module('events')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'maintenance', {
      title: 'Eventos',
      state: 'events.list',
      roles: ['admin', 'inscriptor', 'user']
    });

    Menus.addSubMenuItem('topbar', 'eventregistrations', {
      title: 'Eventos',
      state: 'events.list',
      roles: ['admin', 'inscriptor', 'user']
    });
  }
})();