'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Servicearea = mongoose.model('Servicearea'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, servicearea;

/**
 * Servicearea routes tests
 */
describe('Servicearea CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Servicearea
    user.save(function () {
      servicearea = {
        name: 'Servicearea name'
      };

      done();
    });
  });

  it('should be able to save a Servicearea if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Servicearea
        agent.post('/api/serviceareas')
          .send(servicearea)
          .expect(200)
          .end(function (serviceareaSaveErr, serviceareaSaveRes) {
            // Handle Servicearea save error
            if (serviceareaSaveErr) {
              return done(serviceareaSaveErr);
            }

            // Get a list of Serviceareas
            agent.get('/api/serviceareas')
              .end(function (serviceareasGetErr, serviceareasGetRes) {
                // Handle Servicearea save error
                if (serviceareasGetErr) {
                  return done(serviceareasGetErr);
                }

                // Get Serviceareas list
                var serviceareas = serviceareasGetRes.body;

                // Set assertions
                (serviceareas[0].user._id).should.equal(userId);
                (serviceareas[0].name).should.match('Servicearea name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Servicearea if not logged in', function (done) {
    agent.post('/api/serviceareas')
      .send(servicearea)
      .expect(403)
      .end(function (serviceareaSaveErr, serviceareaSaveRes) {
        // Call the assertion callback
        done(serviceareaSaveErr);
      });
  });

  it('should not be able to save an Servicearea if no name is provided', function (done) {
    // Invalidate name field
    servicearea.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Servicearea
        agent.post('/api/serviceareas')
          .send(servicearea)
          .expect(400)
          .end(function (serviceareaSaveErr, serviceareaSaveRes) {
            // Set message assertion
            (serviceareaSaveRes.body.message).should.match('Please fill Servicearea name');

            // Handle Servicearea save error
            done(serviceareaSaveErr);
          });
      });
  });

  it('should be able to update an Servicearea if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Servicearea
        agent.post('/api/serviceareas')
          .send(servicearea)
          .expect(200)
          .end(function (serviceareaSaveErr, serviceareaSaveRes) {
            // Handle Servicearea save error
            if (serviceareaSaveErr) {
              return done(serviceareaSaveErr);
            }

            // Update Servicearea name
            servicearea.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Servicearea
            agent.put('/api/serviceareas/' + serviceareaSaveRes.body._id)
              .send(servicearea)
              .expect(200)
              .end(function (serviceareaUpdateErr, serviceareaUpdateRes) {
                // Handle Servicearea update error
                if (serviceareaUpdateErr) {
                  return done(serviceareaUpdateErr);
                }

                // Set assertions
                (serviceareaUpdateRes.body._id).should.equal(serviceareaSaveRes.body._id);
                (serviceareaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Serviceareas if not signed in', function (done) {
    // Create new Servicearea model instance
    var serviceareaObj = new Servicearea(servicearea);

    // Save the servicearea
    serviceareaObj.save(function () {
      // Request Serviceareas
      request(app).get('/api/serviceareas')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Servicearea if not signed in', function (done) {
    // Create new Servicearea model instance
    var serviceareaObj = new Servicearea(servicearea);

    // Save the Servicearea
    serviceareaObj.save(function () {
      request(app).get('/api/serviceareas/' + serviceareaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', servicearea.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Servicearea with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/serviceareas/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Servicearea is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Servicearea which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Servicearea
    request(app).get('/api/serviceareas/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Servicearea with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Servicearea if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Servicearea
        agent.post('/api/serviceareas')
          .send(servicearea)
          .expect(200)
          .end(function (serviceareaSaveErr, serviceareaSaveRes) {
            // Handle Servicearea save error
            if (serviceareaSaveErr) {
              return done(serviceareaSaveErr);
            }

            // Delete an existing Servicearea
            agent.delete('/api/serviceareas/' + serviceareaSaveRes.body._id)
              .send(servicearea)
              .expect(200)
              .end(function (serviceareaDeleteErr, serviceareaDeleteRes) {
                // Handle servicearea error error
                if (serviceareaDeleteErr) {
                  return done(serviceareaDeleteErr);
                }

                // Set assertions
                (serviceareaDeleteRes.body._id).should.equal(serviceareaSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Servicearea if not signed in', function (done) {
    // Set Servicearea user
    servicearea.user = user;

    // Create new Servicearea model instance
    var serviceareaObj = new Servicearea(servicearea);

    // Save the Servicearea
    serviceareaObj.save(function () {
      // Try deleting Servicearea
      request(app).delete('/api/serviceareas/' + serviceareaObj._id)
        .expect(403)
        .end(function (serviceareaDeleteErr, serviceareaDeleteRes) {
          // Set message assertion
          (serviceareaDeleteRes.body.message).should.match('User is not authorized');

          // Handle Servicearea error error
          done(serviceareaDeleteErr);
        });

    });
  });

  it('should be able to get a single Servicearea that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Servicearea
          agent.post('/api/serviceareas')
            .send(servicearea)
            .expect(200)
            .end(function (serviceareaSaveErr, serviceareaSaveRes) {
              // Handle Servicearea save error
              if (serviceareaSaveErr) {
                return done(serviceareaSaveErr);
              }

              // Set assertions on new Servicearea
              (serviceareaSaveRes.body.name).should.equal(servicearea.name);
              should.exist(serviceareaSaveRes.body.user);
              should.equal(serviceareaSaveRes.body.user._id, orphanId);

              // force the Servicearea to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Servicearea
                    agent.get('/api/serviceareas/' + serviceareaSaveRes.body._id)
                      .expect(200)
                      .end(function (serviceareaInfoErr, serviceareaInfoRes) {
                        // Handle Servicearea error
                        if (serviceareaInfoErr) {
                          return done(serviceareaInfoErr);
                        }

                        // Set assertions
                        (serviceareaInfoRes.body._id).should.equal(serviceareaSaveRes.body._id);
                        (serviceareaInfoRes.body.name).should.equal(servicearea.name);
                        should.equal(serviceareaInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Servicearea.remove().exec(done);
    });
  });
});
