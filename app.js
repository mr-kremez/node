var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var HttpError = require('error').HttpError;
var errorhandler = require('errorhandler');
var log = require('libs/log')(module);
var mongoose = require('libs/mongoose');
var session = require('express-session');
var config = require('config');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var MongoStore = require('connect-mongo')(session);

app.use(session({
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  cookie: config.get('session:cookie'),
  saveUninitialized: true,
  resave: false,
  store: new MongoStore({
    url: "mongodb://localhost/chat"
  })
}));

app.use(require('middleware/sendHttpError'));
app.use(require('middleware/loadUser'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


if (app.get('env') === 'development') {
  // only use in development
  app.use(errorhandler())
}

app.use(function(err, req, res, next) {
  if (typeof err === 'number') {
    err = new HttpError(err);
  }
  if(err instanceof HttpError) {
    res.sendHttpError(err);
  } else {
    log.error(err);
    err = new HttpError(500);
    res.sendHttpError(err);
  }
});

module.exports = app;
