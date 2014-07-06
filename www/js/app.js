// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('todo', ['ionic', 'todo.services'])

.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  //var base_url = "http://varitaiapp.zacsi.com/js/";
  $stateProvider.state('landing', {
    url: "/",
    templateUrl: 'js/routes/landing.tpl.html',
    controller: 'landingController',
    authenticate: false
  }).state('inside', {
    url: "/inside",
    templateUrl: 'js/routes/inside.tpl.html',
    controller: 'insideController',
    authenticate: true
  }).state('login', {
    url: "/login",
    templateUrl: 'js/routes/login.tpl.html',
    controller: 'loginController',
    authenticate: false
  });
  $urlRouterProvider.otherwise("/");
}])

.controller('landingController', function($scope, AuthenticationService, $state) {

  $scope.goInside = function() {

    $state.go("inside");

    //console.log("Logging in");
    //AuthenticationService.signIn('jon@tiltvideo.com','tilt225').then(function (response) {

    //  console.log(AuthenticationService.user());

    //});    
  }

})

.controller('loginController', function($scope, AuthenticationService, $state) {

  $scope.login = function() {

    console.log("Logging in");
    AuthenticationService.signIn('jon@tiltvideo.com','tilt225').then(function (response) {

    console.log(AuthenticationService.user());
    
    //console.log(window.localStorage.removeItem("token"));

    $state.go("inside");

    });    
  }

})

.controller('insideController', function($scope, AuthenticationService, $state, $http) {

    console.log("inside controller loaded");

    $http.get('http://dev.tiltvideo.com/api/videos').then(function (response) {

        console.log("success");

    }, function() {
        console.log("failed");
        $state.go("login");
    });

})

.run(function($ionicPlatform,$rootScope, $state, $location, AuthenticationService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {

        AuthenticationService.updateUserState();

        console.log(AuthenticationService.user().isLoggedIn);

    });

})
