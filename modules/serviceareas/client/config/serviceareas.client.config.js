(function() {
  'use strict';

  angular
    .module('serviceareas')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'maintenance', {
      title: 'Áreas de Servicio',
      state: 'serviceareas.list',
      roles: ['admin', 'inscriptor', 'teacher']
    });
  }
})();