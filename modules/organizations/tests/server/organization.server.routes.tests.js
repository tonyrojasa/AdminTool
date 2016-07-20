'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Organization = mongoose.model('Organization'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, organization;

/**
 * Organization routes tests
 */
describe('Organization CRUD tests', function () {

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

    // Save a user to the test db and create new Organization
    user.save(function () {
      organization = {
        name: 'Organization name'
      };

      done();
    });
  });

  it('should be able to save a Organization if logged in', function (done) {
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

        // Save a new Organization
        agent.post('/api/organizations')
          .send(organization)
          .expect(200)
          .end(function (organizationSaveErr, organizationSaveRes) {
            // Handle Organization save error
            if (organizationSaveErr) {
              return done(organizationSaveErr);
            }

            // Get a list of Organizations
            agent.get('/api/organizations')
              .end(function (organizationsGetErr, organizationsGetRes) {
                // Handle Organization save error
                if (organizationsGetErr) {
                  return done(organizationsGetErr);
                }

                // Get Organizations list
                var organizations = organizationsGetRes.body;

                // Set assertions
                (organizations[0].user._id).should.equal(userId);
                (organizations[0].name).should.match('Organization name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Organization if not logged in', function (done) {
    agent.post('/api/organizations')
      .send(organization)
      .expect(403)
      .end(function (organizationSaveErr, organizationSaveRes) {
        // Call the assertion callback
        done(organizationSaveErr);
      });
  });

  it('should not be able to save an Organization if no name is provided', function (done) {
    // Invalidate name field
    organization.name = '';

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

        // Save a new Organization
        agent.post('/api/organizations')
          .send(organization)
          .expect(400)
          .end(function (organizationSaveErr, organizationSaveRes) {
            // Set message assertion
            (organizationSaveRes.body.message).should.match('Please fill Organization name');

            // Handle Organization save error
            done(organizationSaveErr);
          });
      });
  });

  it('should be able to update an Organization if signed in', function (done) {
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

        // Save a new Organization
        agent.post('/api/organizations')
          .send(organization)
          .expect(200)
          .end(function (organizationSaveErr, organizationSaveRes) {
            // Handle Organization save error
            if (organizationSaveErr) {
              return done(organizationSaveErr);
            }

            // Update Organization name
            organization.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Organization
            agent.put('/api/organizations/' + organizationSaveRes.body._id)
              .send(organization)
              .expect(200)
              .end(function (organizationUpdateErr, organizationUpdateRes) {
                // Handle Organization update error
                if (organizationUpdateErr) {
                  return done(organizationUpdateErr);
                }

                // Set assertions
                (organizationUpdateRes.body._id).should.equal(organizationSaveRes.body._id);
                (organizationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Organizations if not signed in', function (done) {
    // Create new Organization model instance
    var organizationObj = new Organization(organization);

    // Save the organization
    organizationObj.save(function () {
      // Request Organizations
      request(app).get('/api/organizations')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Organization if not signed in', function (done) {
    // Create new Organization model instance
    var organizationObj = new Organization(organization);

    // Save the Organization
    organizationObj.save(function () {
      request(app).get('/api/organizations/' + organizationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', organization.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Organization with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/organizations/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Organization is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Organization which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Organization
    request(app).get('/api/organizations/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Organization with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Organization if signed in', function (done) {
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

        // Save a new Organization
        agent.post('/api/organizations')
          .send(organization)
          .expect(200)
          .end(function (organizationSaveErr, organizationSaveRes) {
            // Handle Organization save error
            if (organizationSaveErr) {
              return done(organizationSaveErr);
            }

            // Delete an existing Organization
            agent.delete('/api/organizations/' + organizationSaveRes.body._id)
              .send(organization)
              .expect(200)
              .end(function (organizationDeleteErr, organizationDeleteRes) {
                // Handle organization error error
                if (organizationDeleteErr) {
                  return done(organizationDeleteErr);
                }

                // Set assertions
                (organizationDeleteRes.body._id).should.equal(organizationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Organization if not signed in', function (done) {
    // Set Organization user
    organization.user = user;

    // Create new Organization model instance
    var organizationObj = new Organization(organization);

    // Save the Organization
    organizationObj.save(function () {
      // Try deleting Organization
      request(app).delete('/api/organizations/' + organizationObj._id)
        .expect(403)
        .end(function (organizationDeleteErr, organizationDeleteRes) {
          // Set message assertion
          (organizationDeleteRes.body.message).should.match('User is not authorized');

          // Handle Organization error error
          done(organizationDeleteErr);
        });

    });
  });

  it('should be able to get a single Organization that has an orphaned user reference', function (done) {
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

          // Save a new Organization
          agent.post('/api/organizations')
            .send(organization)
            .expect(200)
            .end(function (organizationSaveErr, organizationSaveRes) {
              // Handle Organization save error
              if (organizationSaveErr) {
                return done(organizationSaveErr);
              }

              // Set assertions on new Organization
              (organizationSaveRes.body.name).should.equal(organization.name);
              should.exist(organizationSaveRes.body.user);
              should.equal(organizationSaveRes.body.user._id, orphanId);

              // force the Organization to have an orphaned user reference
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

                    // Get the Organization
                    agent.get('/api/organizations/' + organizationSaveRes.body._id)
                      .expect(200)
                      .end(function (organizationInfoErr, organizationInfoRes) {
                        // Handle Organization error
                        if (organizationInfoErr) {
                          return done(organizationInfoErr);
                        }

                        // Set assertions
                        (organizationInfoRes.body._id).should.equal(organizationSaveRes.body._id);
                        (organizationInfoRes.body.name).should.equal(organization.name);
                        should.equal(organizationInfoRes.body.user, undefined);

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
      Organization.remove().exec(done);
    });
  });
});
