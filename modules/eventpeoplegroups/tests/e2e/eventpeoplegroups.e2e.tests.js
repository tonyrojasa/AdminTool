'use strict';

describe('Eventpeoplegroups E2E Tests:', function () {
  describe('Test Eventpeoplegroups page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/eventpeoplegroups');
      expect(element.all(by.repeater('eventpeoplegroup in eventpeoplegroups')).count()).toEqual(0);
    });
  });
});
