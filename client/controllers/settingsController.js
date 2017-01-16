angular.module('myApp').controller('settingsController', 
  ['$scope', 'SettingsService', 
  function ($scope, SettingsService) {

    $scope.changePrivacy = function () {
      SettingsService.setPrivacy(!$scope.privacy)
    }

    $scope.getPrivacy = function () {
      SettingsService.getPrivacy()
        .then(function (res) {
          $scope.privacy = res.data.private;
          $scope.username = res.data.username;
        })
        .catch(function (err) {
          console.log(err)
        }) 
    }

    $scope.$on('$viewContentLoaded', function () {
      $scope.getPrivacy();
    })

}])