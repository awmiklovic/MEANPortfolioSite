app.controller('projectsCtrl', ['$scope', 'projects', 'Upload', 'auth', function($scope, projects, Upload, auth){
	$scope.projects = projects.projects;

	$scope.createProject = function(path){
		projects.create({
			name : $scope.name,
			imgURL : path,
			desc: $scope.desc,
			link: $scope.link
		});
		$scope.name="";
		$scope.picFile="";
		$scope.desc="";
		$scope.link="";
	};

	$scope.deleteProject = function(id){
		projects.delete(id);
	}

	$scope.uploadPic = function(file) {
	    file.upload = Upload.upload({
	      url: '/uploads',
	      data: {file: file},
	    }).then(function(resp){
	    	$scope.createProject('images/uploads/'+resp.data.filename);
	    });
    }
}]);

app.factory('projects', ['$http', 'auth', function($http, auth){

	var s = {
		projects : []
	};

	s.getAll = function(){
		return $http.get('/projects').success(function(data){
			angular.copy(data, s.projects);
		});
	}

	s.create = function(project){
		return $http.post('/projects', project, { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
			s.projects.push(data);
		});
	};

	s.delete = function(id) {
		return $http.delete('/projects/' + id, { headers: {Authorization: 'Bearer '+auth.getToken()}}).then(function(){
			s.getAll();
		});	
	};

	return s;


}]);