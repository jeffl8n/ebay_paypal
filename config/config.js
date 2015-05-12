var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development',
    port = process.env.PORT || 3000;

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'ep-questions'
    },
    sg: {
      password: 't37ue8YW8j98mIY',
      smtp_server: 'smtp.sendgrid.net',
      username: 'azure_6564498b523fa6c923e29170e5c3a778@azure.com'
    },
    port: port,
    db: 'mongodb://journalDB:journalDB@ds060977.mongolab.com:60977/journal-db'
  },

  test: {
    root: rootPath,
    app: {
      name: 'ep-questions'
    },
    sg: {
      password: 't37ue8YW8j98mIY',
      smtp_server: 'smtp.sendgrid.net',
      username: 'azure_6564498b523fa6c923e29170e5c3a778@azure.com'
    },
    port: port,
    db: 'mongodb://journalDB:journalDB@ds060977.mongolab.com:60977/journal-db'
  },

  production: {
    root: rootPath,
    app: {
      name: 'ep-questions'
    },
    sg: {
      password: 't37ue8YW8j98mIY',
      smtp_server: 'smtp.sendgrid.net',
      username: 'azure_6564498b523fa6c923e29170e5c3a778@azure.com'
    },
    port: port,
    db: 'mongodb://journalDB:journalDB@ds060977.mongolab.com:60977/journal-db'
  }
};

module.exports = config[env];
