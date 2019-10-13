(function() {
  'use strict';

  angular
    .module('eventregistrationrequests')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Solicitudes',
      state: 'eventregistrationrequests',
      type: 'dropdown',
      roles: ['admin', 'inscriptor', 'user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'eventregistrationrequests', {
      title: 'Solicitudes de Inscripcion',
      state: 'eventregistrationrequests.list',
      roles: ['admin', 'inscriptor', 'user']
    });
  }
})();