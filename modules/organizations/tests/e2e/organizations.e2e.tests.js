'use strict';

describe('Organizations E2E Tests:', function () {
  describe('Test Organizations page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/organizations');
      expect(element.all(by.repeater('organization in organizations')).count()).toEqual(0);
    });
  });
});
