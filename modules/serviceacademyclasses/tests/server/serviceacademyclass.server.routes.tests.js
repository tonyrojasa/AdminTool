'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Serviceacademyclass = mongoose.model('Serviceacademyclass'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, serviceacademyclass;

/**
 * Serviceacademyclass routes tests
 */
describe('Serviceacademyclass CRUD tests', function() {

  before(function(done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function(done) {
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

    // Save a user to the test db and create new Serviceacademyclass
    user.save(function() {
      serviceacademyclass = {
        name: 'Serviceacademyclass name'
      };

      done();
    });
  });

  it('should be able to save a Serviceacademyclass if logged in', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Serviceacademyclass
        agent.post('/api/serviceacademyclasses')
          .send(serviceacademyclass)
          .expect(200)
          .end(function(serviceacademyclassSaveErr, serviceacademyclassSaveRes) {
            // Handle Serviceacademyclass save error
            if (serviceacademyclassSaveErr) {
              return done(serviceacademyclassSaveErr);
            }

            // Get a list of Serviceacademyclasses
            agent.get('/api/serviceacademyclasses')
              .end(function(serviceacademyclasssGetErr, serviceacademyclasssGetRes) {
                // Handle Serviceacademyclass save error
                if (serviceacademyclasssGetErr) {
                  return done(serviceacademyclasssGetErr);
                }

                // Get Serviceacademyclasses list
                var serviceacademyclasses = serviceacademyclasssGetRes.body;

                // Set assertions
                (serviceacademyclasses[0].user._id).should.equal(userId);
                (serviceacademyclasses[0].name).should.match('Serviceacademyclass name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Serviceacademyclass if not logged in', function(done) {
    agent.post('/api/serviceacademyclasses')
      .send(serviceacademyclass)
      .expect(403)
      .end(function(serviceacademyclassSaveErr, serviceacademyclassSaveRes) {
        // Call the assertion callback
        done(serviceacademyclassSaveErr);
      });
  });

  it('should not be able to save an Serviceacademyclass if no name is provided', function(done) {
    // Invalidate name field
    serviceacademyclass.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Serviceacademyclass
        agent.post('/api/serviceacademyclasses')
          .send(serviceacademyclass)
          .expect(400)
          .end(function(serviceacademyclassSaveErr, serviceacademyclassSaveRes) {
            // Set message assertion
            (serviceacademyclassSaveRes.body.message).should.match('Please fill Serviceacademyclass name');

            // Handle Serviceacademyclass save error
            done(serviceacademyclassSaveErr);
          });
      });
  });

  it('should be able to update an Serviceacademyclass if signed in', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Serviceacademyclass
        agent.post('/api/serviceacademyclasses')
          .send(serviceacademyclass)
          .expect(200)
          .end(function(serviceacademyclassSaveErr, serviceacademyclassSaveRes) {
            // Handle Serviceacademyclass save error
            if (serviceacademyclassSaveErr) {
              return done(serviceacademyclassSaveErr);
            }

            // Update Serviceacademyclass name
            serviceacademyclass.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Serviceacademyclass
            agent.put('/api/serviceacademyclasses/' + serviceacademyclassSaveRes.body._id)
              .send(serviceacademyclass)
              .expect(200)
              .end(function(serviceacademyclassUpdateErr, serviceacademyclassUpdateRes) {
                // Handle Serviceacademyclass update error
                if (serviceacademyclassUpdateErr) {
                  return done(serviceacademyclassUpdateErr);
                }

                // Set assertions
                (serviceacademyclassUpdateRes.body._id).should.equal(serviceacademyclassSaveRes.body._id);
                (serviceacademyclassUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Serviceacademyclasses if not signed in', function(done) {
    // Create new Serviceacademyclass model instance
    var serviceacademyclassObj = new Serviceacademyclass(serviceacademyclass);

    // Save the serviceacademyclass
    serviceacademyclassObj.save(function() {
      // Request Serviceacademyclasses
      request(app).get('/api/serviceacademyclasses')
        .end(function(req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Serviceacademyclass if not signed in', function(done) {
    // Create new Serviceacademyclass model instance
    var serviceacademyclassObj = new Serviceacademyclass(serviceacademyclass);

    // Save the Serviceacademyclass
    serviceacademyclassObj.save(function() {
      request(app).get('/api/serviceacademyclasses/' + serviceacademyclassObj._id)
        .end(function(req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', serviceacademyclass.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Serviceacademyclass with an invalid Id, if not signed in', function(done) {
    // test is not a valid mongoose Id
    request(app).get('/api/serviceacademyclasses/test')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Serviceacademyclass is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Serviceacademyclass which doesnt exist, if not signed in', function(done) {
    // This is a valid mongoose Id but a non-existent Serviceacademyclass
    request(app).get('/api/serviceacademyclasses/559e9cd815f80b4c256a8f41')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Serviceacademyclass with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Serviceacademyclass if signed in', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Serviceacademyclass
        agent.post('/api/serviceacademyclasses')
          .send(serviceacademyclass)
          .expect(200)
          .end(function(serviceacademyclassSaveErr, serviceacademyclassSaveRes) {
            // Handle Serviceacademyclass save error
            if (serviceacademyclassSaveErr) {
              return done(serviceacademyclassSaveErr);
            }

            // Delete an existing Serviceacademyclass
            agent.delete('/api/serviceacademyclasses/' + serviceacademyclassSaveRes.body._id)
              .send(serviceacademyclass)
              .expect(200)
              .end(function(serviceacademyclassDeleteErr, serviceacademyclassDeleteRes) {
                // Handle serviceacademyclass error error
                if (serviceacademyclassDeleteErr) {
                  return done(serviceacademyclassDeleteErr);
                }

                // Set assertions
                (serviceacademyclassDeleteRes.body._id).should.equal(serviceacademyclassSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Serviceacademyclass if not signed in', function(done) {
    // Set Serviceacademyclass user
    serviceacademyclass.user = user;

    // Create new Serviceacademyclass model instance
    var serviceacademyclassObj = new Serviceacademyclass(serviceacademyclass);

    // Save the Serviceacademyclass
    serviceacademyclassObj.save(function() {
      // Try deleting Serviceacademyclass
      request(app).delete('/api/serviceacademyclasses/' + serviceacademyclassObj._id)
        .expect(403)
        .end(function(serviceacademyclassDeleteErr, serviceacademyclassDeleteRes) {
          // Set message assertion
          (serviceacademyclassDeleteRes.body.message).should.match('User is not authorized');

          // Handle Serviceacademyclass error error
          done(serviceacademyclassDeleteErr);
        });

    });
  });

  it('should be able to get a single Serviceacademyclass that has an orphaned user reference', function(done) {
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

    _orphan.save(function(err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function(signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Serviceacademyclass
          agent.post('/api/serviceacademyclasses')
            .send(serviceacademyclass)
            .expect(200)
            .end(function(serviceacademyclassSaveErr, serviceacademyclassSaveRes) {
              // Handle Serviceacademyclass save error
              if (serviceacademyclassSaveErr) {
                return done(serviceacademyclassSaveErr);
              }

              // Set assertions on new Serviceacademyclass
              (serviceacademyclassSaveRes.body.name).should.equal(serviceacademyclass.name);
              should.exist(serviceacademyclassSaveRes.body.user);
              should.equal(serviceacademyclassSaveRes.body.user._id, orphanId);

              // force the Serviceacademyclass to have an orphaned user reference
              orphan.remove(function() {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function(err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Serviceacademyclass
                    agent.get('/api/serviceacademyclasses/' + serviceacademyclassSaveRes.body._id)
                      .expect(200)
                      .end(function(serviceacademyclassInfoErr, serviceacademyclassInfoRes) {
                        // Handle Serviceacademyclass error
                        if (serviceacademyclassInfoErr) {
                          return done(serviceacademyclassInfoErr);
                        }

                        // Set assertions
                        (serviceacademyclassInfoRes.body._id).should.equal(serviceacademyclassSaveRes.body._id);
                        (serviceacademyclassInfoRes.body.name).should.equal(serviceacademyclass.name);
                        should.equal(serviceacademyclassInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function(done) {
    User.remove().exec(function() {
      Serviceacademyclass.remove().exec(done);
    });
  });
});