(function() {
  'use strict';

  angular
    .module('eventpeoplegroups')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'maintenance', {
      title: 'Grupo de Personas',
      state: 'eventpeoplegroups.list',
      roles: ['admin', 'inscriptor']
    });
  }
})();