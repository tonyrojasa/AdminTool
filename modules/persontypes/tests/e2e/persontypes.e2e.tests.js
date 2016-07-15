'use strict';

describe('Persontypes E2E Tests:', function () {
  describe('Test Persontypes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/persontypes');
      expect(element.all(by.repeater('persontype in persontypes')).count()).toEqual(0);
    });
  });
});
