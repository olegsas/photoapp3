angular.module('myApp').controller('mainController', ['$scope', 'PictureService',
  function ($scope, PictureService) {

    $scope.isDisabled = false;

    $scope.uploadPic = function (file) {
      $scope.isDisabled = true;

      PictureService.uploadPic(file)
        .then(function (res) {
          $scope.isDisabled = false;
          $scope.picFile = null;
          $scope.pictures.push(res.data);
        }).catch(function(err){
          console.log(err)
        })
    }

    $scope.getAllPics = function () {
      PictureService.getAllPics()
        .then(function (res) {
          if (res.data) {
            $scope.pictures = res.data;
          } else {
            $scope.pictures = [];
          }
        })
        .catch(function(err){
          console.log(err);
        })
    }

    $scope.deletePic = function (pic) {
        var picUrl = encodeURIComponent(pic);
        console.log(pic)
        PictureService.removePicture(picUrl)
          .then(function (res) {
            var index = $scope.pictures.indexOf(pic);
            $scope.pictures.splice(index, 1);     
          })
          .catch(function (err) {
            console.log(err)
          })
    }

    $scope.$on('$viewContentLoaded', function () {
      $scope.getAllPics();
    });
  }
]);