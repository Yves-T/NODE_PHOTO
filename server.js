const express = require('express');
const path = require('path');
const config = require('./app/config/config');
const photoGridApp = require('./app');
const passport = require('passport');
const cookieParser = require('cookie-parser');


const app = express();

app.use(cookieParser());
app.use(photoGridApp.session);
app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 3000);
app.set('host', config.host);

const server = require('http').Server(app);
const io = require('socket.io')(server);
app.use('/', photoGridApp.router(io));
app.use('/auth/google', photoGridApp.googleRouter);

server.listen(app.get('port'), () => {
    console.log('Server running on port: ' + app.get('port'));
});
