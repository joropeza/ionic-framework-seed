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
    $state.go("inside");

    });    
  }

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

        if (toState.authenticate && !AuthenticationService.user().isLoggedIn) {
            // User isn’t authenticated
            $state.transitionTo("login");
            event.preventDefault();

            console.log(AuthenticationService.user().userName);
            //$scope.$apply(function () { $location.path("/login"); });
            //$location.path("/login");
        }
    });

})
