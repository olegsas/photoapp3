var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var cloudinary = require('cloudinary');
var fs = require('fs');
var findRemoveSync = require('find-remove');
var multiparty = require('connect-multiparty');
var User = require('../models/user');
var utils = require('../utils')

var multipartyMiddleware = multiparty({
  uploadDir: './uploads'
});

router.post('/save', multipartyMiddleware, function (req, res) {
  var file = req.files.file;

  cloudinary.uploader.upload(file.path, function (result) {
    findRemoveSync('./uploads', {dir: "*", files: "*.*"})
    User.findByIdAndUpdate(
       req.user,
       {$push: {"images": result.url}},
       {safe: true, upsert: true, new : true},
       function(err, model) {
          if (err) console.log(err)
          res.send(result.url)
       }
    );
  });

})

router.get('/get-all', function (req, res) {
  if(req.user) {
    User.findById(req.user, function (err, user) {
      if (err) console.log(err);
      res.send(user.images)
    });
  } else {
    res.send({})
  }
})

// --------> ++ add remove from cloudinary later
router.delete('/:picUrl', function (req, res) {

  User.findOne(req.user, function (err, user) {

    if (!err) {
      var index = user.images.indexOf(req.params.picUrl);
      var id = utils.getImgId(req.params.picUrl);

      // remove ing from cloudinary
      cloudinary.uploader.destroy(id, function(result) { 

        user.images.splice(index, 1)
        user.save(function (err) {
          if (!err) res.sendStatus(200);
        })

      });
    }
  })
})

module.exports = router;