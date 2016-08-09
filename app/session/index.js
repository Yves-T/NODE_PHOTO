'use strict';

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('../config/config');
var mongoose = require('mongoose');


if (process.env.NODE_ENV === 'production') {
  module.exports = session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  });
} else {
  module.exports = session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  });
}

