var myApp = angular.module('myApp',['ngRoute', 'ngCookies']);

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
	}).when('/delivery',{
		templateUrl: 'views/delivery.html',
		controller: 'myController'
	}).when('/checkout', {
		templateUrl: 'views/checkout.html',
		controller: 'checkoutController'
	}).when('/cancel', {
		templateUrl: 'views/cancel.html',
		controller: 'checkoutController'
	})
});

myApp.controller('myController', function($scope, $http, $location, $cookies){
	 // var Test-Secret-Key = 'sk_test_MJ2Vm8AM8mdJE2D34qyRgjHf';
	 // var pk-test-key ='pk_test_ts8osad8adqQf9ihzDwGmxrR';

if(($location.path() != '/') && ($location.path() != '/login')&& ($location.path() != '/register')){

	$http.get("http://localhost:3000/getUserData?token=" + $cookies.get('token'),{
	}).then(function successCallback(response){
		if(response.data.failure == 'badToken'){
			//User needs to login
			$location.path('/login');
		}else{
			$scope.userOptions = response.data;
		}
	}, function errorCallback(response){
		console.log(response.status);
	});
}

	$scope.loginForm = function(){
		$http.post('http://localhost:3000/login',{
			username: $scope.username,
			password: $scope.password
		}).then(function successCallback(response){
			if(response.data.success == 'found'){
				$cookies.put('token', response.data.token);
				$cookies.put('username', $scope.username);
				$location.path('/options');
			}else if(response.data.failure == 'noUser'){
				$location.path('/register');
				// $scope.errorMessage = 'No such user found';
			}else if(response.data.failure == 'badPassword'){
				$scope.errorMessage = "Bad password";
			}
		},function errorCallback(response){
			console.log('error');
		})
	};

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
					$cookies.put('token', response.data.token);
					$cookies.put('username', $scope.username);
					$location.path('/options');
				}
			},function errorCallback(response){

			})
		}
	};

	$scope.optionsForm = function(planType){
		$http.post("http://localhost:3000/options", {
			token: $cookies.get('token'),
			plan: planType,
			grind: $scope.grind,
			quantity: $scope.quantity,
			frequency: $scope.frequency
		}).then(function successCallback(response){
			if(response.data.success == 'update'){
				$location.path('/delivery');
			}else if( response.data.failure == 'nomatch'){
				$location.path('/login');
			}
		},function errorCallback(response){
			console.log("Error");
			}
		)
	};

	$scope.deliveryForm = function(){
		$http.post('http://localhost:3000/delivery', {
			token: $cookies.get('token'),
			fullName: $scope.fullName,
			address: $scope.address,
			address2: $scope.address2,
			city: $scope.city,
			state: $scope.state,
			zip: $scope.zip,
			deliveryDate: $scope.deliveryDate
		}).then(function successCallback(response){
			if(response.data.failure == 'nomatch'){
				$location.path('/login');
			}else if(response.data.success == 'update'){
				$location.path('/checkout');
			}
			},function errorCallback(response){
				console.log("Error");
				}
			)
	};
});

myApp.controller('checkoutController', function($scope, $http, $location, $cookies){
	
	$http.get("http://localhost:3000/getUserData?token=" + $cookies.get('token'),{
		}).then(function successCallback(response){
			if(response.data.failure == 'noToken'){
				$location.path('/login');
			}else if(response.data.failure =='badToken'){
				$location.path('/login');
			}else{
				var userOptions = response.data;
				$scope.fullName = userOptions.fullName;
				$scope.address = userOptions.address;
				$scope.address2 = userOptions.address2;
				$scope.city = userOptions.city;
				$scope.state = userOptions.state;
				$scope.zip = userOptions.zip;
				$scope.deliveryDate = userOptions.deliveryDate;
				$scope.planType = userOptions.plan;
				$scope.grind = userOptions.grind;
				$scope.quantity = userOptions.quantity;
				$scope.frequency = userOptions.frequency;
			}
			}, function errorCallback(response){
			console.log("ERROR");
			}
		);

	$scope.paymentForm = function(){
		console.log("PAY");
	}

	$scope.cancelForm = function(){
		console.log("CANCEL");
		$location.path('/cancel');
	}
});


