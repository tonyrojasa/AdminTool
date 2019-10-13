'use strict';

describe('Eventregistrationrequests E2E Tests:', function () {
  describe('Test Eventregistrationrequests page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/eventregistrationrequests');
      expect(element.all(by.repeater('eventregistration in eventregistrationrequests')).count()).toEqual(0);
    });
  });
});
