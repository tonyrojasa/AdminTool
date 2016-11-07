'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Eventgroup = mongoose.model('Eventgroup'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, eventgroup;

/**
 * Eventgroup routes tests
 */
describe('Eventgroup CRUD tests', function () {

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

    // Save a user to the test db and create new Eventgroup
    user.save(function () {
      eventgroup = {
        name: 'Eventgroup name'
      };

      done();
    });
  });

  it('should be able to save a Eventgroup if logged in', function (done) {
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

        // Save a new Eventgroup
        agent.post('/api/eventgroups')
          .send(eventgroup)
          .expect(200)
          .end(function (eventgroupSaveErr, eventgroupSaveRes) {
            // Handle Eventgroup save error
            if (eventgroupSaveErr) {
              return done(eventgroupSaveErr);
            }

            // Get a list of Eventgroups
            agent.get('/api/eventgroups')
              .end(function (eventgroupsGetErr, eventgroupsGetRes) {
                // Handle Eventgroup save error
                if (eventgroupsGetErr) {
                  return done(eventgroupsGetErr);
                }

                // Get Eventgroups list
                var eventgroups = eventgroupsGetRes.body;

                // Set assertions
                (eventgroups[0].user._id).should.equal(userId);
                (eventgroups[0].name).should.match('Eventgroup name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Eventgroup if not logged in', function (done) {
    agent.post('/api/eventgroups')
      .send(eventgroup)
      .expect(403)
      .end(function (eventgroupSaveErr, eventgroupSaveRes) {
        // Call the assertion callback
        done(eventgroupSaveErr);
      });
  });

  it('should not be able to save an Eventgroup if no name is provided', function (done) {
    // Invalidate name field
    eventgroup.name = '';

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

        // Save a new Eventgroup
        agent.post('/api/eventgroups')
          .send(eventgroup)
          .expect(400)
          .end(function (eventgroupSaveErr, eventgroupSaveRes) {
            // Set message assertion
            (eventgroupSaveRes.body.message).should.match('Please fill Eventgroup name');

            // Handle Eventgroup save error
            done(eventgroupSaveErr);
          });
      });
  });

  it('should be able to update an Eventgroup if signed in', function (done) {
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

        // Save a new Eventgroup
        agent.post('/api/eventgroups')
          .send(eventgroup)
          .expect(200)
          .end(function (eventgroupSaveErr, eventgroupSaveRes) {
            // Handle Eventgroup save error
            if (eventgroupSaveErr) {
              return done(eventgroupSaveErr);
            }

            // Update Eventgroup name
            eventgroup.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Eventgroup
            agent.put('/api/eventgroups/' + eventgroupSaveRes.body._id)
              .send(eventgroup)
              .expect(200)
              .end(function (eventgroupUpdateErr, eventgroupUpdateRes) {
                // Handle Eventgroup update error
                if (eventgroupUpdateErr) {
                  return done(eventgroupUpdateErr);
                }

                // Set assertions
                (eventgroupUpdateRes.body._id).should.equal(eventgroupSaveRes.body._id);
                (eventgroupUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Eventgroups if not signed in', function (done) {
    // Create new Eventgroup model instance
    var eventgroupObj = new Eventgroup(eventgroup);

    // Save the eventgroup
    eventgroupObj.save(function () {
      // Request Eventgroups
      request(app).get('/api/eventgroups')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Eventgroup if not signed in', function (done) {
    // Create new Eventgroup model instance
    var eventgroupObj = new Eventgroup(eventgroup);

    // Save the Eventgroup
    eventgroupObj.save(function () {
      request(app).get('/api/eventgroups/' + eventgroupObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', eventgroup.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Eventgroup with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/eventgroups/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Eventgroup is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Eventgroup which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Eventgroup
    request(app).get('/api/eventgroups/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Eventgroup with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Eventgroup if signed in', function (done) {
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

        // Save a new Eventgroup
        agent.post('/api/eventgroups')
          .send(eventgroup)
          .expect(200)
          .end(function (eventgroupSaveErr, eventgroupSaveRes) {
            // Handle Eventgroup save error
            if (eventgroupSaveErr) {
              return done(eventgroupSaveErr);
            }

            // Delete an existing Eventgroup
            agent.delete('/api/eventgroups/' + eventgroupSaveRes.body._id)
              .send(eventgroup)
              .expect(200)
              .end(function (eventgroupDeleteErr, eventgroupDeleteRes) {
                // Handle eventgroup error error
                if (eventgroupDeleteErr) {
                  return done(eventgroupDeleteErr);
                }

                // Set assertions
                (eventgroupDeleteRes.body._id).should.equal(eventgroupSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Eventgroup if not signed in', function (done) {
    // Set Eventgroup user
    eventgroup.user = user;

    // Create new Eventgroup model instance
    var eventgroupObj = new Eventgroup(eventgroup);

    // Save the Eventgroup
    eventgroupObj.save(function () {
      // Try deleting Eventgroup
      request(app).delete('/api/eventgroups/' + eventgroupObj._id)
        .expect(403)
        .end(function (eventgroupDeleteErr, eventgroupDeleteRes) {
          // Set message assertion
          (eventgroupDeleteRes.body.message).should.match('User is not authorized');

          // Handle Eventgroup error error
          done(eventgroupDeleteErr);
        });

    });
  });

  it('should be able to get a single Eventgroup that has an orphaned user reference', function (done) {
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

          // Save a new Eventgroup
          agent.post('/api/eventgroups')
            .send(eventgroup)
            .expect(200)
            .end(function (eventgroupSaveErr, eventgroupSaveRes) {
              // Handle Eventgroup save error
              if (eventgroupSaveErr) {
                return done(eventgroupSaveErr);
              }

              // Set assertions on new Eventgroup
              (eventgroupSaveRes.body.name).should.equal(eventgroup.name);
              should.exist(eventgroupSaveRes.body.user);
              should.equal(eventgroupSaveRes.body.user._id, orphanId);

              // force the Eventgroup to have an orphaned user reference
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

                    // Get the Eventgroup
                    agent.get('/api/eventgroups/' + eventgroupSaveRes.body._id)
                      .expect(200)
                      .end(function (eventgroupInfoErr, eventgroupInfoRes) {
                        // Handle Eventgroup error
                        if (eventgroupInfoErr) {
                          return done(eventgroupInfoErr);
                        }

                        // Set assertions
                        (eventgroupInfoRes.body._id).should.equal(eventgroupSaveRes.body._id);
                        (eventgroupInfoRes.body.name).should.equal(eventgroup.name);
                        should.equal(eventgroupInfoRes.body.user, undefined);

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
      Eventgroup.remove().exec(done);
    });
  });
});
