(function () {
  'use strict';

  angular
    .module('eventpeoplegroups')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Grupo de Personas',
      state: 'eventpeoplegroups',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'eventpeoplegroups', {
      title: 'Lista de Grupo de Personas',
      state: 'eventpeoplegroups.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'eventpeoplegroups', {
      title: 'Crear Grupo de personas',
      state: 'eventpeoplegroups.create',
      roles: ['user']
    });
  }
})();
