'use strict';

describe('People E2E Tests:', function () {
  describe('Test People page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/people');
      expect(element.all(by.repeater('person in people')).count()).toEqual(0);
    });
  });
});
