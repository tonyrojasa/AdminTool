'use strict';

describe('Receipts E2E Tests:', function () {
  describe('Test Receipts page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/receipts');
      expect(element.all(by.repeater('receipt in receipts')).count()).toEqual(0);
    });
  });
});
