angular.module('myApp').factory('UsersService', 
  ['$q', '$http', 
  function($q, $http) {
    
    return ({
      getAllUsers: getAllUsers,
      getUserByName: getUserByName
    });

    function getAllUsers () {
      
      var deferred = $q.defer();

      $http.get('http://127.0.0.1:3000/user/all-users')
        .then(function (data) {
          deferred.resolve(data)
        })
        .catch(function (err) {
          deferred.reject(err)
        })

        return deferred.promise;
    }

    function getUserByName (name) {

      var deferred = $q.defer();

      $http.get('http://127.0.0.1:3000/user/' + name)
        .then(function (data) {
          deferred.resolve(data)
        })
        .catch(function (err) {
          deferred.reject(err)
        })

        return deferred.promise;
    }

}]);