'use strict';

describe('Serviceareas E2E Tests:', function () {
  describe('Test Serviceareas page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/serviceareas');
      expect(element.all(by.repeater('servicearea in serviceareas')).count()).toEqual(0);
    });
  });
});
