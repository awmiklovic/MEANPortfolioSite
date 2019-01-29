app.controller('userCtrl', ['$scope', 'userInfo', 'mail', 'Upload', 'auth', function($scope, userInfo, mail, Upload, auth){

	var info = userInfo.user;
	$scope.allUsers = userInfo.allUsers;
		
		$scope.testimonialInit = function(){
			if(info.testimonial){
				$scope.testimonial = info.testimonial.testimonialBody;
				$scope.approved = info.testimonial.approved;
			}	
			else{
				$scope.testimonial == null;
				return;
			}
		}


		$scope.profile = {
			imgURL : info.imgURL || 'images/rs-photo-v1.jpg',
			firstName : info.firstName,
			lastName : info.lastName,
			displayName : info.firstName + " " + info.lastName,
			email : info.email,
			company : info.company,
			position : info.position
		};

	$scope.updateUser = function(){
		userInfo.updateUser($scope.profile);
	}

	$scope.uploadPic = function(file) {
	    file.upload = Upload.upload({
	      url: '/uploads',
	      data: {file: file},
	      headers: {Authorization: 'Bearer '+auth.getToken()}
	    }).then(function(resp){
	    	$scope.profile.imgURL = 'images/uploads/'+resp.data.filename;
	    	$scope.updateUser();
	    });
    }

	$scope.deleteUser = function(user){
		userInfo.deleteUser(user);
	}
	
	$scope.addTestimonial = function(){
		if ($scope.testimonialBody=="") return;
		$scope.testimonial = $scope.testimonialBody;
		userInfo.updateUser({
			"testimonial": {
				"testimonialBody": $scope.testimonialBody,
				"approved": false
			}
		});
		mail.send({
      		recipient: "alex@brunch.digital",
      		subject: "A new testimonial has been submitted!",
      		message: $scope.profile.displayName + " submitted a new testimonial:\n\n" + $scope.testimonialBody
      	});
	}

	$scope.editTestimonial = function(){
		$scope.testimonial = '';
}	

}]);

app.factory('userInfo', ['$http', 'auth', function($http, auth){
	var s = {
		user : [],
		allUsers: []
	};

	user = auth.currentUser();

	s.getAll = function(){
		return $http.get('/users/'+user).success(function(data){
			angular.copy(data, s.user);
		});
	}

	s.getAllUsers = function(){
		return $http.get('/users/').success(function(data){
			angular.copy(data, s.allUsers);
		})
	}

	s.deleteUser = function(user){
		return $http.delete('/users/'+user, { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
			s.getAllUsers();
		})
	}

	s.updateUser = function(info){
		return $http.put('/users/'+user, info, { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
			angular.copy(data, s.user);
		})
	}

	return s;
}]);