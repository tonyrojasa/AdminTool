'use strict';

/**
 * Module dependencies
 */
var studentsPolicy = require('../policies/students.server.policy'),
  students = require('../controllers/students.server.controller');

module.exports = function(app) {
  // Students Routes
  app.route('/api/students').all(studentsPolicy.isAllowed)
    .get(students.list)
    .post(students.create);

  app.route('/api/students/:studentId').all(studentsPolicy.isAllowed)
    .get(students.read)
    .put(students.update)
    .delete(students.delete);

  app.route('/api/serviceacademyclasses/:serviceacademyclassId/students').all(studentsPolicy.isAllowed)
    .get(students.listAcademyStudents);

  // Finish by binding the Student middleware
  app.param('studentId', students.studentByID);
  app.param('serviceacademyclassId', students.listAcademyStudents);
};