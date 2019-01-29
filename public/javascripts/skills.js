app.controller('skillCtrl', ['$scope', 'skills', 'Upload', function($scope, skills, Upload){
	$scope.skills = skills.skills;

	$scope.createSkill = function(path){
		skills.create({
			name : $scope.name,
			cat: $scope.cat,
			imgURL : path
		});
		$scope.name="";
		$scope.picFile="";
		$scope.cat="frontend";
	};

	$scope.deleteSkill = function(id){
		skills.delete(id);
	}

	$scope.uploadPic = function(file) {
	    file.upload = Upload.upload({
	      url: '/uploads',
	      data: {file: file},
	    }).then(function(resp){
	    	$scope.createSkill('images/uploads/'+resp.data.filename);
	    });
    }
}]);

app.factory('skills', ['$http', 'auth', function($http, auth){

	var s = {
		skills : []
	};

	s.getAll = function(){
		return $http.get('/skills').success(function(data){
			angular.copy(data, s.skills);
		});
	}

	s.create = function(skill){
		return $http.post('/skills', skill, { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
			s.skills.push(data);
		});
	};

	s.delete = function(id) {
		return $http.delete('/skills/' + id, { headers: {Authorization: 'Bearer '+auth.getToken()}}).then(function(){
			s.getAll();
		});	
	};

	return s;


}]);

