'use strict';

describe('Assistances E2E Tests:', function () {
  describe('Test Assistances page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/assistances');
      expect(element.all(by.repeater('assistance in assistances')).count()).toEqual(0);
    });
  });
});
