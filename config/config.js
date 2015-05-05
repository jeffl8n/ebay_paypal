var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'ep-questions'
    },
    port: 3000,
    db: 'mongodb://journalDB:journalDB@ds060977.mongolab.com:60977/journal-db'
  },

  test: {
    root: rootPath,
    app: {
      name: 'ep-questions'
    },
    port: 3000,
    db: 'mongodb://journalDB:journalDB@ds060977.mongolab.com:60977/journal-db'
  },

  production: {
    root: rootPath,
    app: {
      name: 'ep-questions'
    },
    port: 3000,
    db: 'mongodb://localhost/ep-questions-production'
  }
};

module.exports = config[env];
