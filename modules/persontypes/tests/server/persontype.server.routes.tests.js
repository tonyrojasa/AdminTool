'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Persontype = mongoose.model('Persontype'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, persontype;

/**
 * Persontype routes tests
 */
describe('Persontype CRUD tests', function () {

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

    // Save a user to the test db and create new Persontype
    user.save(function () {
      persontype = {
        name: 'Persontype name'
      };

      done();
    });
  });

  it('should be able to save a Persontype if logged in', function (done) {
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

        // Save a new Persontype
        agent.post('/api/persontypes')
          .send(persontype)
          .expect(200)
          .end(function (persontypeSaveErr, persontypeSaveRes) {
            // Handle Persontype save error
            if (persontypeSaveErr) {
              return done(persontypeSaveErr);
            }

            // Get a list of Persontypes
            agent.get('/api/persontypes')
              .end(function (persontypesGetErr, persontypesGetRes) {
                // Handle Persontype save error
                if (persontypesGetErr) {
                  return done(persontypesGetErr);
                }

                // Get Persontypes list
                var persontypes = persontypesGetRes.body;

                // Set assertions
                (persontypes[0].user._id).should.equal(userId);
                (persontypes[0].name).should.match('Persontype name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Persontype if not logged in', function (done) {
    agent.post('/api/persontypes')
      .send(persontype)
      .expect(403)
      .end(function (persontypeSaveErr, persontypeSaveRes) {
        // Call the assertion callback
        done(persontypeSaveErr);
      });
  });

  it('should not be able to save an Persontype if no name is provided', function (done) {
    // Invalidate name field
    persontype.name = '';

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

        // Save a new Persontype
        agent.post('/api/persontypes')
          .send(persontype)
          .expect(400)
          .end(function (persontypeSaveErr, persontypeSaveRes) {
            // Set message assertion
            (persontypeSaveRes.body.message).should.match('Please fill Persontype name');

            // Handle Persontype save error
            done(persontypeSaveErr);
          });
      });
  });

  it('should be able to update an Persontype if signed in', function (done) {
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

        // Save a new Persontype
        agent.post('/api/persontypes')
          .send(persontype)
          .expect(200)
          .end(function (persontypeSaveErr, persontypeSaveRes) {
            // Handle Persontype save error
            if (persontypeSaveErr) {
              return done(persontypeSaveErr);
            }

            // Update Persontype name
            persontype.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Persontype
            agent.put('/api/persontypes/' + persontypeSaveRes.body._id)
              .send(persontype)
              .expect(200)
              .end(function (persontypeUpdateErr, persontypeUpdateRes) {
                // Handle Persontype update error
                if (persontypeUpdateErr) {
                  return done(persontypeUpdateErr);
                }

                // Set assertions
                (persontypeUpdateRes.body._id).should.equal(persontypeSaveRes.body._id);
                (persontypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Persontypes if not signed in', function (done) {
    // Create new Persontype model instance
    var persontypeObj = new Persontype(persontype);

    // Save the persontype
    persontypeObj.save(function () {
      // Request Persontypes
      request(app).get('/api/persontypes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Persontype if not signed in', function (done) {
    // Create new Persontype model instance
    var persontypeObj = new Persontype(persontype);

    // Save the Persontype
    persontypeObj.save(function () {
      request(app).get('/api/persontypes/' + persontypeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', persontype.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Persontype with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/persontypes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Persontype is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Persontype which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Persontype
    request(app).get('/api/persontypes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Persontype with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Persontype if signed in', function (done) {
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

        // Save a new Persontype
        agent.post('/api/persontypes')
          .send(persontype)
          .expect(200)
          .end(function (persontypeSaveErr, persontypeSaveRes) {
            // Handle Persontype save error
            if (persontypeSaveErr) {
              return done(persontypeSaveErr);
            }

            // Delete an existing Persontype
            agent.delete('/api/persontypes/' + persontypeSaveRes.body._id)
              .send(persontype)
              .expect(200)
              .end(function (persontypeDeleteErr, persontypeDeleteRes) {
                // Handle persontype error error
                if (persontypeDeleteErr) {
                  return done(persontypeDeleteErr);
                }

                // Set assertions
                (persontypeDeleteRes.body._id).should.equal(persontypeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Persontype if not signed in', function (done) {
    // Set Persontype user
    persontype.user = user;

    // Create new Persontype model instance
    var persontypeObj = new Persontype(persontype);

    // Save the Persontype
    persontypeObj.save(function () {
      // Try deleting Persontype
      request(app).delete('/api/persontypes/' + persontypeObj._id)
        .expect(403)
        .end(function (persontypeDeleteErr, persontypeDeleteRes) {
          // Set message assertion
          (persontypeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Persontype error error
          done(persontypeDeleteErr);
        });

    });
  });

  it('should be able to get a single Persontype that has an orphaned user reference', function (done) {
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

          // Save a new Persontype
          agent.post('/api/persontypes')
            .send(persontype)
            .expect(200)
            .end(function (persontypeSaveErr, persontypeSaveRes) {
              // Handle Persontype save error
              if (persontypeSaveErr) {
                return done(persontypeSaveErr);
              }

              // Set assertions on new Persontype
              (persontypeSaveRes.body.name).should.equal(persontype.name);
              should.exist(persontypeSaveRes.body.user);
              should.equal(persontypeSaveRes.body.user._id, orphanId);

              // force the Persontype to have an orphaned user reference
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

                    // Get the Persontype
                    agent.get('/api/persontypes/' + persontypeSaveRes.body._id)
                      .expect(200)
                      .end(function (persontypeInfoErr, persontypeInfoRes) {
                        // Handle Persontype error
                        if (persontypeInfoErr) {
                          return done(persontypeInfoErr);
                        }

                        // Set assertions
                        (persontypeInfoRes.body._id).should.equal(persontypeSaveRes.body._id);
                        (persontypeInfoRes.body.name).should.equal(persontype.name);
                        should.equal(persontypeInfoRes.body.user, undefined);

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
      Persontype.remove().exec(done);
    });
  });
});
