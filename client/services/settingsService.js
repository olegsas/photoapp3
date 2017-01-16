angular.module('myApp').factory('SettingsService', 
  ['$q', '$http', 
  function ($q, $http) {

    return ({
      getPrivacy: getPrivacy,
      setPrivacy: setPrivacy
    })

    function getPrivacy () {
      var deferred = $q.defer();

      $http.get('http://127.0.0.1:3000/user/settings/get-privacy')
        .then(function (data) {
          deferred.resolve(data)
        })
        .catch(function (err) {
          deferred.reject(err)
        })

        return deferred.promise;
    }

    function setPrivacy (privacy) {
      var deferred = $q.defer();

      $http.put('http://127.0.0.1:3000/user/settings/change-privacy', {
        privacy: privacy
      })
      .then(function (data) {
        deferred.resolve(data)
      })
      .catch(function (err) {
        deferred.reject(err)
      })

      return deferred.promise;
    }

}]);