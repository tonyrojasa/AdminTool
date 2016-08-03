'use strict';

var cfenv = require('cfenv'),
  appEnv = cfenv.getAppEnv();
var cfMongoUrl = (function() {
  if (appEnv.getService('mean-mongo')) {
    var mongoCreds = appEnv.getService('mean-mongo').credentials;
    return mongoCreds.uri || mongoCreds.url;
  } else {
    throw new Error('No service names "mean-mongo" bound to the application.');
  }
}());

var getCred = function(serviceName, credProp) {
  return appEnv.getService(serviceName) ?
    appEnv.getService(serviceName).credentials[credProp] : undefined;
};

module.exports = {
  port: appEnv.port,
  db: {
    uri: cfMongoUrl,
    options: {
      user: '',
      pass: ''
    }
  },
  log: {
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'combined',
    // Stream defaults to process.stdout
    // By default we want logs to go to process.out so the Cloud Foundry Loggregator will collect them
    options: {}
  },
  facebook: {
    clientID: getCred('mean-facebook', 'id') || '1352435898107058',
    clientSecret: getCred('mean-facebook', 'secret') || 'bc0e8c87e4bc98ed073a0b4109700eda',
    callbackURL: '/api/auth/facebook/callback'
  },
  twitter: {
    clientID: getCred('mean-twitter', 'key') || 'VGC5JCT5OJsUOIe0BZsR1e0IA',
    clientSecret: getCred('mean-twitter', 'secret') || '7VM6QEId6qLpvKiaWdqRfRLOcJyFkKyRO7NjikEdJLV9XpLEhH',
    callbackURL: '/api/auth/twitter/callback'
  },
  google: {
    clientID: getCred('mean-google', 'id') || '634322409918-ijcbj102ccuircqlq4t9itklcnao1dgg.apps.googleusercontent.com',
    clientSecret: getCred('mean-google', 'secret') || 'qhsRTYBIT8yZdo2ykNhbsNJ9',
    callbackURL: '/api/auth/google/callback'
  },
  linkedin: {
    clientID: getCred('mean-linkedin', 'id') || 'APP_ID',
    clientSecret: getCred('mean-linkedin', 'secret') || 'APP_SECRET',
    callbackURL: '/api/auth/linkedin/callback'
  },
  github: {
    clientID: getCred('mean-github', 'id') || 'APP_ID',
    clientSecret: getCred('mean-github', 'secret') || 'APP_SECRET',
    callbackURL: '/api/auth/github/callback'
  },
  paypal: {
    clientID: getCred('mean-paypal', 'id') || 'CLIENT_ID',
    clientSecret: getCred('mean-paypal', 'secret') || 'CLIENT_SECRET',
    callbackURL: '/api/auth/paypal/callback',
    sandbox: false
  },
  mailer: {
    from: getCred('mean-mail', 'from') || 'juntagdc@gmail.com',
    options: {
      service: getCred('mean-mail', 'service') || 'Gmail',
      auth: {
        user: getCred('mean-mail', 'username') || 'juntagdc',
        pass: getCred('mean-mail', 'password') || 'GeneracionDC'
      }
    }
  },
  seedDB: {
    seed: process.env.MONGO_SEED === 'true',
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS !== 'false',
      seedUser: {
        username: process.env.MONGO_SEED_USER_USERNAME || 'user',
        provider: 'local',
        email: process.env.MONGO_SEED_USER_EMAIL || 'user@localhost.com',
        firstName: 'User',
        lastName: 'Local',
        displayName: 'User Local',
        roles: ['user']
      },
      seedAdmin: {
        username: process.env.MONGO_SEED_ADMIN_USERNAME || 'admin',
        provider: 'local',
        email: process.env.MONGO_SEED_ADMIN_EMAIL || 'admin@localhost.com',
        firstName: 'Admin',
        lastName: 'Local',
        displayName: 'Admin Local',
        roles: ['user', 'admin']
      }
    }
  }
};