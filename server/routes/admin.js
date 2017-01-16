var express = require('express');
var router = express.Router();
var cloudinary = require('cloudinary');
var fs = require('fs');
var findRemoveSync = require('find-remove');
var multiparty = require('connect-multiparty');
var mongoose = require('mongoose');
var User = require('../models/user.js');
var utils = require('../utils');

var multipartyMiddleware = multiparty({
  uploadDir: './uploads'
});

router.post('/upload-picture', multipartyMiddleware, function (req, res) {
  var file = req.files.file;

  cloudinary.uploader.upload(file.path, function (result) {
    findRemoveSync('./uploads', {dir: "*", files: "*.*"})
    User.findOneAndUpdate(
       {username: req.body.user},
       {$push: {"images": result.url}},
       {safe: true, upsert: true, new : true},
       function(err, model) {
          if (err) console.log(err)
          res.send(result.url)
       }
    );
  });

})

router.delete('/delete-picture/:user/:picUrl', checkIfAdmin, function (req, res) {
  User.findOne({username: req.params.user}, function (err, user) {
    if (!err) {
      var index = user.images.indexOf(req.params.picUrl);
      var id = utils.getImgId(req.params.picUrl);

      if (index >= 0) {
        cloudinary.uploader.destroy(id, function(result) { 

          user.images.splice(index, 1)
          user.save(function (err) {
            if (!err) res.sendStatus(200);
          })

        })
      } else {
        res.status(404).send('No such image')
      }
    }
  })
});


function checkIfAdmin(req, res, next) {
  if (req.user) {
    User.findById(req.user, function (err, user) {
      if (err) {
        console.log(err);
      } else {
        if (req.user.isAdmin) {
          next()
        } else {
          res.status(403).send('You are not admin')
        }
      }
    })
  } else {
    res.status(403).send('Please log in')
  }
}


module.exports = router;