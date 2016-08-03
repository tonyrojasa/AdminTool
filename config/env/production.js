'use strict';

module.exports = {
  secure: {
    ssl: true,
    privateKey: './config/sslcerts/key.pem',
    certificate: './config/sslcerts/cert.pem',
    caBundle: './config/sslcerts/cabundle.crt'
  },
  port: process.env.PORT || 8443,
  // Binding to 127.0.0.1 is safer in production.
  host: process.env.HOST || '0.0.0.0',
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/mean',
    options: {
      user: '',
      pass: ''
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: process.env.LOG_FORMAT || 'combined',
    fileLogger: {
      directoryPath: process.env.LOG_DIR_PATH || process.cwd(),
      fileName: process.env.LOG_FILE || 'app.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    }
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || '1352435898107058',
    clientSecret: process.env.FACEBOOK_SECRET || 'bc0e8c87e4bc98ed073a0b4109700eda',
    callbackURL: '/api/auth/facebook/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_KEY || 'VGC5JCT5OJsUOIe0BZsR1e0IA',
    clientSecret: process.env.TWITTER_SECRET || '7VM6QEId6qLpvKiaWdqRfRLOcJyFkKyRO7NjikEdJLV9XpLEhH',
    callbackURL: '/api/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || '634322409918-ijcbj102ccuircqlq4t9itklcnao1dgg.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'qhsRTYBIT8yZdo2ykNhbsNJ9',
    callbackURL: '/api/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/github/callback'
  },
  paypal: {
    clientID: process.env.PAYPAL_ID || 'CLIENT_ID',
    clientSecret: process.env.PAYPAL_SECRET || 'CLIENT_SECRET',
    callbackURL: '/api/auth/paypal/callback',
    sandbox: false
  },
  mailer: {
    from: process.env.MAILER_FROM || 'juntagdc@gmail.com',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'juntagdc',
        pass: process.env.MAILER_PASSWORD || 'GeneracionDC'
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