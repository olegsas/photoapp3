// dependencies
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var hash = require('bcrypt-nodejs');
var path = require('path');
var cloudinary = require('cloudinary');
var passport = require('passport');
var localStrategy = require('passport-local' ).Strategy;

// mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/kotogramm');

// user schema/model
var User = require('./models/user.js');

// create instance of express
var app = express();

// require routes
var userRoutes = require('./routes/api.js');
var authRoutes = require('./routes/auth.js');
var pictureRoutes = require('./routes/pictures.js');
var adminRoutes = require('./routes/admin.js')

// define middleware
app.use(express.static(path.join(__dirname, '../client')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// cloudinary config
cloudinary.config({
  cloud_name: 'dpojy95nf',
  api_key: '782415393211716',
  api_secret: '288qvYM8NQ9qh0Tv9fPaxRVLQC4'
});

// routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/pictures', pictureRoutes);
app.use('/admin', adminRoutes);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

// error hndlers
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.end(JSON.stringify({
    message: err.message,
    error: {}
  }));
});

module.exports = app;
