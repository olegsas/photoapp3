angular.module('myApp').controller('userController', 
  ['$scope', 'UsersService', '$routeParams', 'AuthService', 'AdminService',
  function ($scope, UsersService, $routeParams, AuthService, AdminService) {

    $scope.isDisabled = false;

    $scope.$on('$viewContentLoaded', function () {
      $scope.getUserByName($routeParams.user);
      $scope.checkIfAdmin();
    });

    $scope.getUserByName = function(username) {
      UsersService.getUserByName(username)
        .then(function (res) {
          $scope.pictures = res.data.images;
          $scope.username = res.data.username;
          $scope.error = false;
        })
        .catch(function (err) {
          $scope.error = true;
        })
    }

    $scope.checkIfAdmin = function () {
      AuthService.isAdmin()
        .then(function (res) {
          $scope.isAdmin = res;
        })
        .catch(function (err) {
          console.log(err)
        })
    }

    $scope.uploadPictureToUser = function (file, user) {
      $scope.isDisabled = true;

      AdminService.uploadPictureToUser(file, user)

        .then(function (res) {
          $scope.isDisabled = false;
          $scope.picFile = null;
          $scope.pictures.push(res.data);
        })
        
        .catch(function(err){
          console.log(err)
        })
    }

    $scope.deletePictureFromUser = function (user, pic) {
      var picUrl = encodeURIComponent(pic);

      AdminService.removePicture(user, picUrl)

        .then(function (res) {
          var index = $scope.pictures.indexOf(pic);
          $scope.pictures.splice(index, 1);     
        })

        .catch(function (err) {
          console.log(err)
        })
    }

}])