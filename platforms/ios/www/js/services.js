angular.module('todo.services', [])

.factory('AuthenticationService', ['$rootScope', '$http', '$q', '$location',

function ($rootScope, $http, $q, $location) {

    var UserModel = {
        // Set default user state
        userName: null,
        isLoggedIn: false,
        access: 1,
        token: null
    };

    var getToken = function (userName, password) {

        console.log("get token?");

        var pString = "userName=jon%40tiltvideo.com&password=tilt225&grant_type=password";   

        // Send the $http request and return the promise
        return $http.post('http://dev.tiltvideo.com/api/token', pString, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

    };

    return {

        signIn: function (userName, password) {

            var dfd = $q.defer();

            // Request a token with username & password
            getToken(userName, password).then(function (response) {

                // Set new user model
                UserModel = {
                    userName: response.data.userName,
                    isLoggedIn: true,
                    access: parseInt(response.data.access),
                    token: 'Bearer ' + response.data.access_token
                };

                
                window.localStorage.setItem("token", response.data.access_token);

                console.log(window.localStorage.getItem("token"));

/*

                // Set user cookie
                $.cookie('user', angular.toJson(UserModel), { path: '/' });

                // Set default headers
                //Restangular.setDefaultHeaders({ Authorization: $cookieStore.get('user').token });
                $http.defaults.headers.common["Authorization"] = angular.fromJson($.cookie('user')).token;

                $rootScope.token = angular.fromJson($.cookie('user')).token;
*/
               // Resolve the promise

                $http.defaults.headers.common["Authorization"] = UserModel.token;

                dfd.resolve();

                // If request for token fails, reject the promise
            }, function () { dfd.reject('Wrong email or password. Try again!'); });

            return dfd.promise;
        },

        signOut: function () {
            var dfd = $q.defer();

            // Call api
            //Restangular.one('accounts/logout').post().then(function () {
            // Remove the cookie
            $.removeCookie('user', { path: '/' });

            // Set the UserModel back to defaults
            UserModel = {
                userName: null,
                isLoggedIn: false,
                access: 1,
                token: null
            };

            console.log("User logged out");

            dfd.resolve();


            return dfd.promise;
        },

        updateUserState: function () {

            var dfd = $q.defer(),
            user = angular.fromJson($.cookie('user'));

            // Check user cookie
            if (user !== undefined && user.token !== undefined) {

                // While defining token, we'll temporarily log in user and set the cookie values
                // These will be overriden later -> We dont want the user to have to wait ro be
                // redirected while we determine if they're legit. We'll just move them
                // away later if they're not
                UserModel = user;

                $http.defaults.headers.common["Authorization"] = angular.fromJson($.cookie('user')).token;


                dfd.resolve();

            } else {

                // If user cookie is undefined or the token is not set, reject the promise
                dfd.reject();

            }

            return dfd.promise;
        },
        loginMethods: function () {
            // $http returns a promise, which has a then function, which also returns a promise


            //var promise = $http.get('/Api/Videos/Enhancements?GUID=c0890c91-8e0d-45ec-9e92-8648761b1238.mp4').then(function (response) {
            var promise = $http.get('/api/Account/ExternalLogins?returnUrl=%2FexternalLogin&generateState=true').then(function (response) {
                //
                // The then function here is an opportunity to modify the response
                console.log(response);
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        },
        user: function () { return UserModel; }

    };

}])


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