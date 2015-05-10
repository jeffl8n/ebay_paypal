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
    port: port,
    db: 'mongodb://journalDB:journalDB@ds060977.mongolab.com:60977/journal-db'
  },

  test: {
    root: rootPath,
    app: {
      name: 'ep-questions'
    },
    port: port,
    db: 'mongodb://journalDB:journalDB@ds060977.mongolab.com:60977/journal-db'
  },

  production: {
    root: rootPath,
    app: {
      name: 'ep-questions'
    },
    port: port,
    db: 'mongodb://journalDB:journalDB@ds060977.mongolab.com:60977/journal-db'
  }
};

module.exports = config[env];
