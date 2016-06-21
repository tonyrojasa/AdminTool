'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Eventregistration = mongoose.model('Eventregistration'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, eventregistration;

/**
 * Eventregistration routes tests
 */
describe('Eventregistration CRUD tests', function () {

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

    // Save a user to the test db and create new Eventregistration
    user.save(function () {
      eventregistration = {
        name: 'Eventregistration name'
      };

      done();
    });
  });

  it('should be able to save a Eventregistration if logged in', function (done) {
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

        // Save a new Eventregistration
        agent.post('/api/eventregistrations')
          .send(eventregistration)
          .expect(200)
          .end(function (eventregistrationSaveErr, eventregistrationSaveRes) {
            // Handle Eventregistration save error
            if (eventregistrationSaveErr) {
              return done(eventregistrationSaveErr);
            }

            // Get a list of Eventregistrations
            agent.get('/api/eventregistrations')
              .end(function (eventregistrationsGetErr, eventregistrationsGetRes) {
                // Handle Eventregistration save error
                if (eventregistrationsGetErr) {
                  return done(eventregistrationsGetErr);
                }

                // Get Eventregistrations list
                var eventregistrations = eventregistrationsGetRes.body;

                // Set assertions
                (eventregistrations[0].user._id).should.equal(userId);
                (eventregistrations[0].name).should.match('Eventregistration name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Eventregistration if not logged in', function (done) {
    agent.post('/api/eventregistrations')
      .send(eventregistration)
      .expect(403)
      .end(function (eventregistrationSaveErr, eventregistrationSaveRes) {
        // Call the assertion callback
        done(eventregistrationSaveErr);
      });
  });

  it('should not be able to save an Eventregistration if no name is provided', function (done) {
    // Invalidate name field
    eventregistration.name = '';

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

        // Save a new Eventregistration
        agent.post('/api/eventregistrations')
          .send(eventregistration)
          .expect(400)
          .end(function (eventregistrationSaveErr, eventregistrationSaveRes) {
            // Set message assertion
            (eventregistrationSaveRes.body.message).should.match('Please fill Eventregistration name');

            // Handle Eventregistration save error
            done(eventregistrationSaveErr);
          });
      });
  });

  it('should be able to update an Eventregistration if signed in', function (done) {
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

        // Save a new Eventregistration
        agent.post('/api/eventregistrations')
          .send(eventregistration)
          .expect(200)
          .end(function (eventregistrationSaveErr, eventregistrationSaveRes) {
            // Handle Eventregistration save error
            if (eventregistrationSaveErr) {
              return done(eventregistrationSaveErr);
            }

            // Update Eventregistration name
            eventregistration.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Eventregistration
            agent.put('/api/eventregistrations/' + eventregistrationSaveRes.body._id)
              .send(eventregistration)
              .expect(200)
              .end(function (eventregistrationUpdateErr, eventregistrationUpdateRes) {
                // Handle Eventregistration update error
                if (eventregistrationUpdateErr) {
                  return done(eventregistrationUpdateErr);
                }

                // Set assertions
                (eventregistrationUpdateRes.body._id).should.equal(eventregistrationSaveRes.body._id);
                (eventregistrationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Eventregistrations if not signed in', function (done) {
    // Create new Eventregistration model instance
    var eventregistrationObj = new Eventregistration(eventregistration);

    // Save the eventregistration
    eventregistrationObj.save(function () {
      // Request Eventregistrations
      request(app).get('/api/eventregistrations')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Eventregistration if not signed in', function (done) {
    // Create new Eventregistration model instance
    var eventregistrationObj = new Eventregistration(eventregistration);

    // Save the Eventregistration
    eventregistrationObj.save(function () {
      request(app).get('/api/eventregistrations/' + eventregistrationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', eventregistration.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Eventregistration with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/eventregistrations/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Eventregistration is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Eventregistration which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Eventregistration
    request(app).get('/api/eventregistrations/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Eventregistration with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Eventregistration if signed in', function (done) {
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

        // Save a new Eventregistration
        agent.post('/api/eventregistrations')
          .send(eventregistration)
          .expect(200)
          .end(function (eventregistrationSaveErr, eventregistrationSaveRes) {
            // Handle Eventregistration save error
            if (eventregistrationSaveErr) {
              return done(eventregistrationSaveErr);
            }

            // Delete an existing Eventregistration
            agent.delete('/api/eventregistrations/' + eventregistrationSaveRes.body._id)
              .send(eventregistration)
              .expect(200)
              .end(function (eventregistrationDeleteErr, eventregistrationDeleteRes) {
                // Handle eventregistration error error
                if (eventregistrationDeleteErr) {
                  return done(eventregistrationDeleteErr);
                }

                // Set assertions
                (eventregistrationDeleteRes.body._id).should.equal(eventregistrationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Eventregistration if not signed in', function (done) {
    // Set Eventregistration user
    eventregistration.user = user;

    // Create new Eventregistration model instance
    var eventregistrationObj = new Eventregistration(eventregistration);

    // Save the Eventregistration
    eventregistrationObj.save(function () {
      // Try deleting Eventregistration
      request(app).delete('/api/eventregistrations/' + eventregistrationObj._id)
        .expect(403)
        .end(function (eventregistrationDeleteErr, eventregistrationDeleteRes) {
          // Set message assertion
          (eventregistrationDeleteRes.body.message).should.match('User is not authorized');

          // Handle Eventregistration error error
          done(eventregistrationDeleteErr);
        });

    });
  });

  it('should be able to get a single Eventregistration that has an orphaned user reference', function (done) {
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

          // Save a new Eventregistration
          agent.post('/api/eventregistrations')
            .send(eventregistration)
            .expect(200)
            .end(function (eventregistrationSaveErr, eventregistrationSaveRes) {
              // Handle Eventregistration save error
              if (eventregistrationSaveErr) {
                return done(eventregistrationSaveErr);
              }

              // Set assertions on new Eventregistration
              (eventregistrationSaveRes.body.name).should.equal(eventregistration.name);
              should.exist(eventregistrationSaveRes.body.user);
              should.equal(eventregistrationSaveRes.body.user._id, orphanId);

              // force the Eventregistration to have an orphaned user reference
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

                    // Get the Eventregistration
                    agent.get('/api/eventregistrations/' + eventregistrationSaveRes.body._id)
                      .expect(200)
                      .end(function (eventregistrationInfoErr, eventregistrationInfoRes) {
                        // Handle Eventregistration error
                        if (eventregistrationInfoErr) {
                          return done(eventregistrationInfoErr);
                        }

                        // Set assertions
                        (eventregistrationInfoRes.body._id).should.equal(eventregistrationSaveRes.body._id);
                        (eventregistrationInfoRes.body.name).should.equal(eventregistration.name);
                        should.equal(eventregistrationInfoRes.body.user, undefined);

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
      Eventregistration.remove().exec(done);
    });
  });
});
