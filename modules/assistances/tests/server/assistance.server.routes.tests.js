'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Assistance = mongoose.model('Assistance'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, assistance;

/**
 * Assistance routes tests
 */
describe('Assistance CRUD tests', function () {

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

    // Save a user to the test db and create new Assistance
    user.save(function () {
      assistance = {
        name: 'Assistance name'
      };

      done();
    });
  });

  it('should be able to save a Assistance if logged in', function (done) {
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

        // Save a new Assistance
        agent.post('/api/assistances')
          .send(assistance)
          .expect(200)
          .end(function (assistanceSaveErr, assistanceSaveRes) {
            // Handle Assistance save error
            if (assistanceSaveErr) {
              return done(assistanceSaveErr);
            }

            // Get a list of Assistances
            agent.get('/api/assistances')
              .end(function (assistancesGetErr, assistancesGetRes) {
                // Handle Assistance save error
                if (assistancesGetErr) {
                  return done(assistancesGetErr);
                }

                // Get Assistances list
                var assistances = assistancesGetRes.body;

                // Set assertions
                (assistances[0].user._id).should.equal(userId);
                (assistances[0].name).should.match('Assistance name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Assistance if not logged in', function (done) {
    agent.post('/api/assistances')
      .send(assistance)
      .expect(403)
      .end(function (assistanceSaveErr, assistanceSaveRes) {
        // Call the assertion callback
        done(assistanceSaveErr);
      });
  });

  it('should not be able to save an Assistance if no name is provided', function (done) {
    // Invalidate name field
    assistance.name = '';

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

        // Save a new Assistance
        agent.post('/api/assistances')
          .send(assistance)
          .expect(400)
          .end(function (assistanceSaveErr, assistanceSaveRes) {
            // Set message assertion
            (assistanceSaveRes.body.message).should.match('Please fill Assistance name');

            // Handle Assistance save error
            done(assistanceSaveErr);
          });
      });
  });

  it('should be able to update an Assistance if signed in', function (done) {
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

        // Save a new Assistance
        agent.post('/api/assistances')
          .send(assistance)
          .expect(200)
          .end(function (assistanceSaveErr, assistanceSaveRes) {
            // Handle Assistance save error
            if (assistanceSaveErr) {
              return done(assistanceSaveErr);
            }

            // Update Assistance name
            assistance.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Assistance
            agent.put('/api/assistances/' + assistanceSaveRes.body._id)
              .send(assistance)
              .expect(200)
              .end(function (assistanceUpdateErr, assistanceUpdateRes) {
                // Handle Assistance update error
                if (assistanceUpdateErr) {
                  return done(assistanceUpdateErr);
                }

                // Set assertions
                (assistanceUpdateRes.body._id).should.equal(assistanceSaveRes.body._id);
                (assistanceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Assistances if not signed in', function (done) {
    // Create new Assistance model instance
    var assistanceObj = new Assistance(assistance);

    // Save the assistance
    assistanceObj.save(function () {
      // Request Assistances
      request(app).get('/api/assistances')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Assistance if not signed in', function (done) {
    // Create new Assistance model instance
    var assistanceObj = new Assistance(assistance);

    // Save the Assistance
    assistanceObj.save(function () {
      request(app).get('/api/assistances/' + assistanceObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', assistance.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Assistance with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/assistances/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Assistance is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Assistance which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Assistance
    request(app).get('/api/assistances/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Assistance with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Assistance if signed in', function (done) {
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

        // Save a new Assistance
        agent.post('/api/assistances')
          .send(assistance)
          .expect(200)
          .end(function (assistanceSaveErr, assistanceSaveRes) {
            // Handle Assistance save error
            if (assistanceSaveErr) {
              return done(assistanceSaveErr);
            }

            // Delete an existing Assistance
            agent.delete('/api/assistances/' + assistanceSaveRes.body._id)
              .send(assistance)
              .expect(200)
              .end(function (assistanceDeleteErr, assistanceDeleteRes) {
                // Handle assistance error error
                if (assistanceDeleteErr) {
                  return done(assistanceDeleteErr);
                }

                // Set assertions
                (assistanceDeleteRes.body._id).should.equal(assistanceSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Assistance if not signed in', function (done) {
    // Set Assistance user
    assistance.user = user;

    // Create new Assistance model instance
    var assistanceObj = new Assistance(assistance);

    // Save the Assistance
    assistanceObj.save(function () {
      // Try deleting Assistance
      request(app).delete('/api/assistances/' + assistanceObj._id)
        .expect(403)
        .end(function (assistanceDeleteErr, assistanceDeleteRes) {
          // Set message assertion
          (assistanceDeleteRes.body.message).should.match('User is not authorized');

          // Handle Assistance error error
          done(assistanceDeleteErr);
        });

    });
  });

  it('should be able to get a single Assistance that has an orphaned user reference', function (done) {
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

          // Save a new Assistance
          agent.post('/api/assistances')
            .send(assistance)
            .expect(200)
            .end(function (assistanceSaveErr, assistanceSaveRes) {
              // Handle Assistance save error
              if (assistanceSaveErr) {
                return done(assistanceSaveErr);
              }

              // Set assertions on new Assistance
              (assistanceSaveRes.body.name).should.equal(assistance.name);
              should.exist(assistanceSaveRes.body.user);
              should.equal(assistanceSaveRes.body.user._id, orphanId);

              // force the Assistance to have an orphaned user reference
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

                    // Get the Assistance
                    agent.get('/api/assistances/' + assistanceSaveRes.body._id)
                      .expect(200)
                      .end(function (assistanceInfoErr, assistanceInfoRes) {
                        // Handle Assistance error
                        if (assistanceInfoErr) {
                          return done(assistanceInfoErr);
                        }

                        // Set assertions
                        (assistanceInfoRes.body._id).should.equal(assistanceSaveRes.body._id);
                        (assistanceInfoRes.body.name).should.equal(assistance.name);
                        should.equal(assistanceInfoRes.body.user, undefined);

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
      Assistance.remove().exec(done);
    });
  });
});
