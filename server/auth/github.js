var passport = require('passport');
var User = require('../models/user');

var GitHubStrategy = require('passport-github2').Strategy;
var socialConfig = require('../_social');

// pasport github settings
passport.use(new GitHubStrategy({
  clientID: socialConfig.github.clientID,
  clientSecret: socialConfig.github.clientSecret,
  callbackURL: socialConfig.github.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {

    var searchQuery = {
      username: profile.displayName
    };

    var updates = {
      username: profile.displayName,
      someID: profile.id
    };

    var options = {
      upsert: true
    };

    // update the user if s/he exists or add a new user
    User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
      if(err) {
        return done(err);
      } else {
        return done(null, user);
      }
    });
  }

));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

module.exports = passport;