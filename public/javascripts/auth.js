app.controller('AuthCtrl', [
	'$scope',
	'$state',
	'auth',
	'messages',
	function($scope, $state, auth, messages){
		$scope.user = {};

		$scope.register = function(){
			auth.register($scope.user).error(function(error){
				$scope.error = error;
			}).then(function(){
				var message = {
					To: $scope.user.email,
					From: 'awmiklovic@gmail.com',
					message: 'Hi '+$scope.user.firstName+'! Thank you for checking out my website. You can use the calendar to the left to schedule an interview, and if you have any questions, please feel free to send me a message below. If you are an existing client and are happy with my services, please leave me a testimonial above. Thanks! :)'
				}
				messages.create(message);
				$state.go('/dashboard');
			});
		};

		$scope.logIn = function(){
			auth.logIn($scope.user).error(function(error){
				$scope.error = error;
			}).then(function(){
				$state.go('/dashboard');
			});
		};

	$scope.headerbg = "https://hd.unsplash.com/photo-1461749280684-dccba630e2f6";
	$scope.logoLight = "/images/amLogoWhite.png";

	}
]);

app.factory('auth', ['$http', '$window', function($http, $window){

	var auth = {};

	auth.saveToken = function(token){
		$window.localStorage['flapper-news-token'] = token;
	};

	auth.getToken = function(){
		return $window.localStorage['flapper-news-token'];
	};

	auth.isLoggedIn = function(){
		var token = auth.getToken();

		if(token){
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	};

	auth.currentUser = function(){
		if (auth.isLoggedIn()){
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.email;
		}
	};

	auth.isAdmin = function(){
		if (auth.isLoggedIn()){
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.admin;
		}
	}

	auth.register = function(user){
		return $http.post('/register', user).success(function(data){
			auth.saveToken(data.token);
		});
	};

	auth.logIn = function(user){
		return $http.post('/login', user).success(function(data){
			auth.saveToken(data.token);
		});
	};

	auth.logOut = function(){
		$window.localStorage.removeItem('flapper-news-token');
		$window.location.reload();
	};

	return auth;
}]);
