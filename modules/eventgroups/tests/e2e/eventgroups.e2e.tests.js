'use strict';

describe('Eventgroups E2E Tests:', function () {
  describe('Test Eventgroups page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/eventgroups');
      expect(element.all(by.repeater('eventgroup in eventgroups')).count()).toEqual(0);
    });
  });
});
