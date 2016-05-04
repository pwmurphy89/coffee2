var myApp = angular.module('myApp',['ngRoute']);
myApp.controller('myController', function($scope, $http){
	$scope.message = "hello";

	$scope.newMessage = "hello registration";
});


myApp.config(function($routeProvider, $locationProvider){
	$routeProvider.
	when('/',{
		templateUrl: 'views/front.html',
		controller: 'myController'
	}).when('/registration',{
		templateUrl: 'views/registration.html',
		controller: 'myController'
	}).when('/options',{
		templateUrl: 'views/options.html',
		controller: 'myController'
	}).when('/login',{
		templateUrl: 'login.html',
		controller: 'myController'
	})
});