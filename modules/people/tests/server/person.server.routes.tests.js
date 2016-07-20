'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Person = mongoose.model('Person'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, person;

/**
 * Person routes tests
 */
describe('Person CRUD tests', function () {

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

    // Save a user to the test db and create new Person
    user.save(function () {
      person = {
        name: 'Person name'
      };

      done();
    });
  });

  it('should be able to save a Person if logged in', function (done) {
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

        // Save a new Person
        agent.post('/api/people')
          .send(person)
          .expect(200)
          .end(function (personSaveErr, personSaveRes) {
            // Handle Person save error
            if (personSaveErr) {
              return done(personSaveErr);
            }

            // Get a list of People
            agent.get('/api/people')
              .end(function (personsGetErr, peopleGetRes) {
                // Handle Person save error
                if (personsGetErr) {
                  return done(personsGetErr);
                }

                // Get People list
                var people = peopleGetRes.body;

                // Set assertions
                (people[0].user._id).should.equal(userId);
                (people[0].name).should.match('Person name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Person if not logged in', function (done) {
    agent.post('/api/people')
      .send(person)
      .expect(403)
      .end(function (personSaveErr, personSaveRes) {
        // Call the assertion callback
        done(personSaveErr);
      });
  });

  it('should not be able to save an Person if no name is provided', function (done) {
    // Invalidate name field
    person.name = '';

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

        // Save a new Person
        agent.post('/api/people')
          .send(person)
          .expect(400)
          .end(function (personSaveErr, personSaveRes) {
            // Set message assertion
            (personSaveRes.body.message).should.match('Please fill Person name');

            // Handle Person save error
            done(personSaveErr);
          });
      });
  });

  it('should be able to update an Person if signed in', function (done) {
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

        // Save a new Person
        agent.post('/api/people')
          .send(person)
          .expect(200)
          .end(function (personSaveErr, personSaveRes) {
            // Handle Person save error
            if (personSaveErr) {
              return done(personSaveErr);
            }

            // Update Person name
            person.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Person
            agent.put('/api/people/' + personSaveRes.body._id)
              .send(person)
              .expect(200)
              .end(function (personUpdateErr, personUpdateRes) {
                // Handle Person update error
                if (personUpdateErr) {
                  return done(personUpdateErr);
                }

                // Set assertions
                (personUpdateRes.body._id).should.equal(personSaveRes.body._id);
                (personUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of People if not signed in', function (done) {
    // Create new Person model instance
    var personObj = new Person(person);

    // Save the person
    personObj.save(function () {
      // Request People
      request(app).get('/api/people')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Person if not signed in', function (done) {
    // Create new Person model instance
    var personObj = new Person(person);

    // Save the Person
    personObj.save(function () {
      request(app).get('/api/people/' + personObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', person.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Person with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/people/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Person is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Person which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Person
    request(app).get('/api/people/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Person with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Person if signed in', function (done) {
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

        // Save a new Person
        agent.post('/api/people')
          .send(person)
          .expect(200)
          .end(function (personSaveErr, personSaveRes) {
            // Handle Person save error
            if (personSaveErr) {
              return done(personSaveErr);
            }

            // Delete an existing Person
            agent.delete('/api/people/' + personSaveRes.body._id)
              .send(person)
              .expect(200)
              .end(function (personDeleteErr, personDeleteRes) {
                // Handle person error error
                if (personDeleteErr) {
                  return done(personDeleteErr);
                }

                // Set assertions
                (personDeleteRes.body._id).should.equal(personSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Person if not signed in', function (done) {
    // Set Person user
    person.user = user;

    // Create new Person model instance
    var personObj = new Person(person);

    // Save the Person
    personObj.save(function () {
      // Try deleting Person
      request(app).delete('/api/people/' + personObj._id)
        .expect(403)
        .end(function (personDeleteErr, personDeleteRes) {
          // Set message assertion
          (personDeleteRes.body.message).should.match('User is not authorized');

          // Handle Person error error
          done(personDeleteErr);
        });

    });
  });

  it('should be able to get a single Person that has an orphaned user reference', function (done) {
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

          // Save a new Person
          agent.post('/api/people')
            .send(person)
            .expect(200)
            .end(function (personSaveErr, personSaveRes) {
              // Handle Person save error
              if (personSaveErr) {
                return done(personSaveErr);
              }

              // Set assertions on new Person
              (personSaveRes.body.name).should.equal(person.name);
              should.exist(personSaveRes.body.user);
              should.equal(personSaveRes.body.user._id, orphanId);

              // force the Person to have an orphaned user reference
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

                    // Get the Person
                    agent.get('/api/people/' + personSaveRes.body._id)
                      .expect(200)
                      .end(function (personInfoErr, personInfoRes) {
                        // Handle Person error
                        if (personInfoErr) {
                          return done(personInfoErr);
                        }

                        // Set assertions
                        (personInfoRes.body._id).should.equal(personSaveRes.body._id);
                        (personInfoRes.body.name).should.equal(person.name);
                        should.equal(personInfoRes.body.user, undefined);

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
      Person.remove().exec(done);
    });
  });
});
