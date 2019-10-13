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
      title: 'Solicitudes de Inscripcion',
      state: 'eventregistrationrequests.list',
      roles: ['admin', 'inscriptor', 'user']
    });
    Menus.addSubMenuItem('topbar', 'eventregistrations', {
      title: 'Inscripciones',
      state: 'eventregistrations.list',
      roles: ['admin', 'inscriptor', 'user']
    });
    Menus.addSubMenuItem('topbar', 'eventregistrations', {
      title: 'Reporte General',
      state: 'eventregistrations.report',
      roles: ['admin', 'inscriptor', 'user']
    });
    Menus.addSubMenuItem('topbar', 'reports', {
      title: 'Inscripciones - Reporte General',
      state: 'eventregistrations.report',
      roles: ['admin', 'inscriptor', 'user']
    });
    Menus.addSubMenuItem('topbar', 'eventregistrations', {
      title: 'Reporte de Camisas',
      state: 'eventregistrations.shirtsReport',
      roles: ['admin', 'inscriptor', 'user']
    });
    Menus.addSubMenuItem('topbar', 'reports', {
      title: 'Inscripciones - Reporte de Camisas',
      state: 'eventregistrations.shirtsReport',
      roles: ['admin', 'inscriptor', 'user']
    });
  }
})();