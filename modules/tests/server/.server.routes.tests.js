'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
   = mongoose.model(''),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, ;

/**
 *  routes tests
 */
describe(' CRUD tests', function () {

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

    // Save a user to the test db and create new 
    user.save(function () {
       = {
        name: ' name'
      };

      done();
    });
  });

  it('should be able to save a  if logged in', function (done) {
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

        // Save a new 
        agent.post('/api/')
          .send()
          .expect(200)
          .end(function (SaveErr, SaveRes) {
            // Handle  save error
            if (SaveErr) {
              return done(SaveErr);
            }

            // Get a list of 
            agent.get('/api/')
              .end(function (sGetErr, sGetRes) {
                // Handle  save error
                if (sGetErr) {
                  return done(sGetErr);
                }

                // Get  list
                var  = GetRes.body;

                // Set assertions
                ([0].user._id).should.equal(userId);
                ([0].name).should.match(' name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an  if not logged in', function (done) {
    agent.post('/api/')
      .send()
      .expect(403)
      .end(function (SaveErr, SaveRes) {
        // Call the assertion callback
        done(SaveErr);
      });
  });

  it('should not be able to save an  if no name is provided', function (done) {
    // Invalidate name field
    .name = '';

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

        // Save a new 
        agent.post('/api/')
          .send()
          .expect(400)
          .end(function (SaveErr, SaveRes) {
            // Set message assertion
            (SaveRes.body.message).should.match('Please fill  name');

            // Handle  save error
            done(SaveErr);
          });
      });
  });

  it('should be able to update an  if signed in', function (done) {
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

        // Save a new 
        agent.post('/api/')
          .send()
          .expect(200)
          .end(function (SaveErr, SaveRes) {
            // Handle  save error
            if (SaveErr) {
              return done(SaveErr);
            }

            // Update  name
            .name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing 
            agent.put('/api//' + SaveRes.body._id)
              .send()
              .expect(200)
              .end(function (UpdateErr, UpdateRes) {
                // Handle  update error
                if (UpdateErr) {
                  return done(UpdateErr);
                }

                // Set assertions
                (UpdateRes.body._id).should.equal(SaveRes.body._id);
                (UpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of  if not signed in', function (done) {
    // Create new  model instance
    var Obj = new ();

    // Save the 
    Obj.save(function () {
      // Request 
      request(app).get('/api/')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single  if not signed in', function (done) {
    // Create new  model instance
    var Obj = new ();

    // Save the 
    Obj.save(function () {
      request(app).get('/api//' + Obj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', .name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single  with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api//test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', ' is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single  which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent 
    request(app).get('/api//559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No  with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an  if signed in', function (done) {
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

        // Save a new 
        agent.post('/api/')
          .send()
          .expect(200)
          .end(function (SaveErr, SaveRes) {
            // Handle  save error
            if (SaveErr) {
              return done(SaveErr);
            }

            // Delete an existing 
            agent.delete('/api//' + SaveRes.body._id)
              .send()
              .expect(200)
              .end(function (DeleteErr, DeleteRes) {
                // Handle  error error
                if (DeleteErr) {
                  return done(DeleteErr);
                }

                // Set assertions
                (DeleteRes.body._id).should.equal(SaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an  if not signed in', function (done) {
    // Set  user
    .user = user;

    // Create new  model instance
    var Obj = new ();

    // Save the 
    Obj.save(function () {
      // Try deleting 
      request(app).delete('/api//' + Obj._id)
        .expect(403)
        .end(function (DeleteErr, DeleteRes) {
          // Set message assertion
          (DeleteRes.body.message).should.match('User is not authorized');

          // Handle  error error
          done(DeleteErr);
        });

    });
  });

  it('should be able to get a single  that has an orphaned user reference', function (done) {
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

          // Save a new 
          agent.post('/api/')
            .send()
            .expect(200)
            .end(function (SaveErr, SaveRes) {
              // Handle  save error
              if (SaveErr) {
                return done(SaveErr);
              }

              // Set assertions on new 
              (SaveRes.body.name).should.equal(.name);
              should.exist(SaveRes.body.user);
              should.equal(SaveRes.body.user._id, orphanId);

              // force the  to have an orphaned user reference
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

                    // Get the 
                    agent.get('/api//' + SaveRes.body._id)
                      .expect(200)
                      .end(function (InfoErr, InfoRes) {
                        // Handle  error
                        if (InfoErr) {
                          return done(InfoErr);
                        }

                        // Set assertions
                        (InfoRes.body._id).should.equal(SaveRes.body._id);
                        (InfoRes.body.name).should.equal(.name);
                        should.equal(InfoRes.body.user, undefined);

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
      .remove().exec(done);
    });
  });
});
