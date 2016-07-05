'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Eventpeoplegroup = mongoose.model('Eventpeoplegroup'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, eventpeoplegroup;

/**
 * Eventpeoplegroup routes tests
 */
describe('Eventpeoplegroup CRUD tests', function () {

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

    // Save a user to the test db and create new Eventpeoplegroup
    user.save(function () {
      eventpeoplegroup = {
        name: 'Eventpeoplegroup name'
      };

      done();
    });
  });

  it('should be able to save a Eventpeoplegroup if logged in', function (done) {
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

        // Save a new Eventpeoplegroup
        agent.post('/api/eventpeoplegroups')
          .send(eventpeoplegroup)
          .expect(200)
          .end(function (eventpeoplegroupSaveErr, eventpeoplegroupSaveRes) {
            // Handle Eventpeoplegroup save error
            if (eventpeoplegroupSaveErr) {
              return done(eventpeoplegroupSaveErr);
            }

            // Get a list of Eventpeoplegroups
            agent.get('/api/eventpeoplegroups')
              .end(function (eventpeoplegroupsGetErr, eventpeoplegroupsGetRes) {
                // Handle Eventpeoplegroup save error
                if (eventpeoplegroupsGetErr) {
                  return done(eventpeoplegroupsGetErr);
                }

                // Get Eventpeoplegroups list
                var eventpeoplegroups = eventpeoplegroupsGetRes.body;

                // Set assertions
                (eventpeoplegroups[0].user._id).should.equal(userId);
                (eventpeoplegroups[0].name).should.match('Eventpeoplegroup name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Eventpeoplegroup if not logged in', function (done) {
    agent.post('/api/eventpeoplegroups')
      .send(eventpeoplegroup)
      .expect(403)
      .end(function (eventpeoplegroupSaveErr, eventpeoplegroupSaveRes) {
        // Call the assertion callback
        done(eventpeoplegroupSaveErr);
      });
  });

  it('should not be able to save an Eventpeoplegroup if no name is provided', function (done) {
    // Invalidate name field
    eventpeoplegroup.name = '';

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

        // Save a new Eventpeoplegroup
        agent.post('/api/eventpeoplegroups')
          .send(eventpeoplegroup)
          .expect(400)
          .end(function (eventpeoplegroupSaveErr, eventpeoplegroupSaveRes) {
            // Set message assertion
            (eventpeoplegroupSaveRes.body.message).should.match('Please fill Eventpeoplegroup name');

            // Handle Eventpeoplegroup save error
            done(eventpeoplegroupSaveErr);
          });
      });
  });

  it('should be able to update an Eventpeoplegroup if signed in', function (done) {
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

        // Save a new Eventpeoplegroup
        agent.post('/api/eventpeoplegroups')
          .send(eventpeoplegroup)
          .expect(200)
          .end(function (eventpeoplegroupSaveErr, eventpeoplegroupSaveRes) {
            // Handle Eventpeoplegroup save error
            if (eventpeoplegroupSaveErr) {
              return done(eventpeoplegroupSaveErr);
            }

            // Update Eventpeoplegroup name
            eventpeoplegroup.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Eventpeoplegroup
            agent.put('/api/eventpeoplegroups/' + eventpeoplegroupSaveRes.body._id)
              .send(eventpeoplegroup)
              .expect(200)
              .end(function (eventpeoplegroupUpdateErr, eventpeoplegroupUpdateRes) {
                // Handle Eventpeoplegroup update error
                if (eventpeoplegroupUpdateErr) {
                  return done(eventpeoplegroupUpdateErr);
                }

                // Set assertions
                (eventpeoplegroupUpdateRes.body._id).should.equal(eventpeoplegroupSaveRes.body._id);
                (eventpeoplegroupUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Eventpeoplegroups if not signed in', function (done) {
    // Create new Eventpeoplegroup model instance
    var eventpeoplegroupObj = new Eventpeoplegroup(eventpeoplegroup);

    // Save the eventpeoplegroup
    eventpeoplegroupObj.save(function () {
      // Request Eventpeoplegroups
      request(app).get('/api/eventpeoplegroups')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Eventpeoplegroup if not signed in', function (done) {
    // Create new Eventpeoplegroup model instance
    var eventpeoplegroupObj = new Eventpeoplegroup(eventpeoplegroup);

    // Save the Eventpeoplegroup
    eventpeoplegroupObj.save(function () {
      request(app).get('/api/eventpeoplegroups/' + eventpeoplegroupObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', eventpeoplegroup.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Eventpeoplegroup with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/eventpeoplegroups/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Eventpeoplegroup is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Eventpeoplegroup which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Eventpeoplegroup
    request(app).get('/api/eventpeoplegroups/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Eventpeoplegroup with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Eventpeoplegroup if signed in', function (done) {
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

        // Save a new Eventpeoplegroup
        agent.post('/api/eventpeoplegroups')
          .send(eventpeoplegroup)
          .expect(200)
          .end(function (eventpeoplegroupSaveErr, eventpeoplegroupSaveRes) {
            // Handle Eventpeoplegroup save error
            if (eventpeoplegroupSaveErr) {
              return done(eventpeoplegroupSaveErr);
            }

            // Delete an existing Eventpeoplegroup
            agent.delete('/api/eventpeoplegroups/' + eventpeoplegroupSaveRes.body._id)
              .send(eventpeoplegroup)
              .expect(200)
              .end(function (eventpeoplegroupDeleteErr, eventpeoplegroupDeleteRes) {
                // Handle eventpeoplegroup error error
                if (eventpeoplegroupDeleteErr) {
                  return done(eventpeoplegroupDeleteErr);
                }

                // Set assertions
                (eventpeoplegroupDeleteRes.body._id).should.equal(eventpeoplegroupSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Eventpeoplegroup if not signed in', function (done) {
    // Set Eventpeoplegroup user
    eventpeoplegroup.user = user;

    // Create new Eventpeoplegroup model instance
    var eventpeoplegroupObj = new Eventpeoplegroup(eventpeoplegroup);

    // Save the Eventpeoplegroup
    eventpeoplegroupObj.save(function () {
      // Try deleting Eventpeoplegroup
      request(app).delete('/api/eventpeoplegroups/' + eventpeoplegroupObj._id)
        .expect(403)
        .end(function (eventpeoplegroupDeleteErr, eventpeoplegroupDeleteRes) {
          // Set message assertion
          (eventpeoplegroupDeleteRes.body.message).should.match('User is not authorized');

          // Handle Eventpeoplegroup error error
          done(eventpeoplegroupDeleteErr);
        });

    });
  });

  it('should be able to get a single Eventpeoplegroup that has an orphaned user reference', function (done) {
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

          // Save a new Eventpeoplegroup
          agent.post('/api/eventpeoplegroups')
            .send(eventpeoplegroup)
            .expect(200)
            .end(function (eventpeoplegroupSaveErr, eventpeoplegroupSaveRes) {
              // Handle Eventpeoplegroup save error
              if (eventpeoplegroupSaveErr) {
                return done(eventpeoplegroupSaveErr);
              }

              // Set assertions on new Eventpeoplegroup
              (eventpeoplegroupSaveRes.body.name).should.equal(eventpeoplegroup.name);
              should.exist(eventpeoplegroupSaveRes.body.user);
              should.equal(eventpeoplegroupSaveRes.body.user._id, orphanId);

              // force the Eventpeoplegroup to have an orphaned user reference
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

                    // Get the Eventpeoplegroup
                    agent.get('/api/eventpeoplegroups/' + eventpeoplegroupSaveRes.body._id)
                      .expect(200)
                      .end(function (eventpeoplegroupInfoErr, eventpeoplegroupInfoRes) {
                        // Handle Eventpeoplegroup error
                        if (eventpeoplegroupInfoErr) {
                          return done(eventpeoplegroupInfoErr);
                        }

                        // Set assertions
                        (eventpeoplegroupInfoRes.body._id).should.equal(eventpeoplegroupSaveRes.body._id);
                        (eventpeoplegroupInfoRes.body.name).should.equal(eventpeoplegroup.name);
                        should.equal(eventpeoplegroupInfoRes.body.user, undefined);

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
      Eventpeoplegroup.remove().exec(done);
    });
  });
});
