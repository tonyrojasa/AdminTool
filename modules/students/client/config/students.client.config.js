(function() {
  'use strict';

  angular
    .module('students')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'serviceacademyclasses', {
      title: 'Estudiantes',
      state: 'students.list'
    });
  }
})();