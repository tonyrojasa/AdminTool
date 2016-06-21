'use strict';

describe('Eventregistrations E2E Tests:', function () {
  describe('Test Eventregistrations page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/eventregistrations');
      expect(element.all(by.repeater('eventregistration in eventregistrations')).count()).toEqual(0);
    });
  });
});
