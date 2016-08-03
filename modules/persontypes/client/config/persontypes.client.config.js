(function() {
  'use strict';

  angular
    .module('persontypes')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'maintenance', {
      title: 'Tipos de Persona',
      state: 'persontypes.list',
      roles: ['admin', 'inscriptor', 'teacher', 'user']
    });

  }
})();