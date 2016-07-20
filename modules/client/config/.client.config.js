(function () {
  'use strict';

  angular
    .module('')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: '',
      state: '',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', '', {
      title: 'List ',
      state: '.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', '', {
      title: 'Create ',
      state: '.create',
      roles: ['user']
    });
  }
})();
