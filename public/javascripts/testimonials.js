app.controller('testimonialCtrl', ['$scope', 'testimonials', function($scope, testimonials){
	$scope.testimonialsUnapproved = testimonials.unapprovedTestimonials;
	$scope.testimonialsApproved = testimonials.approvedTestimonials;

	$scope.approveTestimonial = function(email){
		testimonials.setApproved(email).then(function(){
			$scope.testimonialsUnapproved = testimonials.getUnapproved;
		});
	}


}]);

app.factory('testimonials', ['$http', 'auth', function($http, auth){

	var s = {
		approvedTestimonials : [],
		unapprovedTestimonials: []
	};

	s.getApproved = function(){
		return $http.get('/testimonial/approved').success(function(data){
			angular.copy(data, s.approvedTestimonials);
		});
	}

	s.setApproved = function(email){
		return $http({
  			method: 'PUT',
  			url: '/testimonial/'+email,
  			headers: {Authorization: 'Bearer '+auth.getToken()}
		});
	};

	s.getUnapproved = function(id) {
		return $http.get('/testimonial/unapproved').success(function(data){
			angular.copy(data, s.unapprovedTestimonials);
		});
	};

	return s;
}]);