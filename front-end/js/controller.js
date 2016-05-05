var myApp = angular.module('myApp',['ngRoute']);

myApp.controller('myController', function($scope, $http, $location){

	$scope.registerForm = function(form){
		if($scope.username==undefined||$scope.password == undefined|| $scope.password2 ==undefined|| $scope.email ==undefined){
			$scope.errorMessage = "Hi! Please make sure to fill out all the inputs.";
		}else{
			$http.post('http://localhost:3000/register', {
				username: $scope.username,
				password: $scope.password,
				password2: $scope.password2,
				email: $scope.email
			}).then(function successCallback(response){
				console.log(response.data);
				if(response.data.failure == 'passwordMatch'){
					$scope.errorMessage = "Hi " +$scope.username+" ! Looks like your passwords \
				don't match.  Please try again.";
				}else if(response.data.success == 'added'){
					$location.path('/options');
				}
			},function errorCallback(response){

			})
		}
	}

	$scope.loginForm = function(){
		$http.post('http://localhost:3000/login',{
			username: $scope.username,
			password: $scope.password
		}).then(function successCallback(response){
			if(response.data.success == 'found'){
				$location.path('/options');
			}else if(response.data.failure == 'nouser'){
				$scope.errorMessage = 'No such user found';
			}else if(response.data.failure == 'badPassword'){
				$scope.errorMessage = "Bad password";
			}
		},function errorCallback(response){

		})
	}
});

myApp.config(function($routeProvider, $locationProvider){
	$routeProvider.
	when('/',{
		templateUrl: 'views/front.html',
		controller: 'myController'
	}).when('/register',{
		templateUrl: 'views/register.html',
		controller: 'myController'
	}).when('/options',{
		templateUrl: 'views/options.html',
		controller: 'myController'
	}).when('/login',{
		templateUrl: 'views/login.html',
		controller: 'myController'
	})
});
