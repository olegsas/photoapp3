var express = require('express');
var router = express.Router();
var passport = require('passport');
var passportGithub = require('../auth/github');

var User = require('../models/user.js');

// github auth
router.get('/github', passportGithub.authenticate('github', { scope: [ 'username:email' ] }));

router.get('/github/callback',
  passportGithub.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication
    console.log('sucess')
    res.redirect('/');
    //res.json(req.user);
  });

module.exports = router;