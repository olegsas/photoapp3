angular.module('myApp').factory('AdminService', 
  ['$q', '$http', 'Upload',
  function ($q, $http, Upload) {

    return ({
      uploadPictureToUser: uploadPictureToUser,
      removePicture: removePicture
    });

    function uploadPictureToUser (file, user) {
      
      var deferred = $q.defer();
      
			Upload.upload({
        url: 'http://127.0.0.1:3000/admin/upload-picture',
        method: 'POST',
        file: file,
        data: {user: user}
      })

			.then(function (data) {
				deferred.resolve(data)
      })

			.catch(function(err){
				deferred.reject(err);
      })

			return deferred.promise;
    } 


		function removePicture (user, picUrl) {

			var deferred = $q.defer();

      $http.delete('http://127.0.0.1:3000/admin/delete-picture/' + user + '/' + picUrl )

        .then(function (data) {
					deferred.resolve(data)
        })
      
        .catch(function(err){
					deferred.reject(err)
        })
			
      return deferred.promise;

		}


  }])