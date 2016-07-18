'use strict';

describe('Serviceacademyclasses E2E Tests:', function () {
  describe('Test Serviceacademyclasses page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/serviceacademyclasses');
      expect(element.all(by.repeater('serviceacademyclass in serviceacademyclasses')).count()).toEqual(0);
    });
  });
});
