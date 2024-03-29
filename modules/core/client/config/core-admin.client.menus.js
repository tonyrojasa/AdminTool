(function() {
  'use strict';

  angular
    .module('core.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Administración',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });
    menuService.addMenuItem('topbar', {
      title: 'Mantenimiento',
      state: 'maintenance',
      type: 'dropdown',
      roles: ['admin', 'inscriptor', 'teacher', 'user']
    });
    menuService.addMenuItem('topbar', {
      title: 'Reportes',
      state: 'reports',
      type: 'dropdown',
      roles: ['admin', 'inscriptor', 'teacher', 'user', 'accountant']
    });
  }
}());