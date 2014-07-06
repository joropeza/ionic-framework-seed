angular.module('todo.services', [])

.factory('Camera', ['$q', function($q) {
 
  return {
    getPicture: function(optionsa) {
      var q = $q.defer();

      var options = {
            quality : 50,
            saveToPhotoAlbum: true,
            mediaType: navigator.camera.MediaType.VIDEO
        };
      
      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        console.log("taking picture");
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);
      
      return q.promise;
    }
  }
}]);