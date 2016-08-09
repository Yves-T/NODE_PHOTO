var mongoose = require('mongoose');
const config = require('../config/config');

const dbUri = config.dbURL;

mongoose.Promise = require('bluebird');
mongoose.connect(config.dbURL, {
  promiseLibrary: require('bluebird')
});

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbUri);
});

mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

var gracefulShutdown = function (msg, callback) {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};

// used by nodemon
process.once('SIGUSR2', function () {
  gracefulShutdown('nodemon restart', function () {
    process.kill(process.pid, 'SIGUSR2');
  });
});

// emitted on application termination
process.on('SIGINT', function () {
  gracefulShutdown('app termination', function () {
    process.exit(0);
  });
});

// emitted when heroku shuts down the process
process.on('SIGTERM', function () {
  gracefulShutdown('Heroku app shutdown', function () {
    process.exit(0);
  });
});

