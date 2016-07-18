'use strict';

describe(' E2E Tests:', function () {
  describe('Test  page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/');
      expect(element.all(by.repeater(' in ')).count()).toEqual(0);
    });
  });
});
