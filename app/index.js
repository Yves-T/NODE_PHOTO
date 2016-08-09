'use strict';

require('./models/db');
require('./auth')();

const ioServer = app => {
  const server = require('http').Server(app);
  const io = require('socket.io')(server);
  return server;
};

module.exports = {
  ioServer,
  router: (io) => require('./routes')(io),
  googleRouter: require('./routes/googleRoute'),
  // db: () => require('./models/db'),
  session: require('./session')
};
