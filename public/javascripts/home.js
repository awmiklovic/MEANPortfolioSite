app.controller('MainCtrl', [
'$scope',
'getContent',
'auth',
'skills',
'abilities',
'projects',
'Upload',
function($scope, getContent, auth, skills, abilities, projects, Upload){

$scope.isLoggedIn = auth.isLoggedIn;
$scope.isAdmin = auth.isAdmin();

var content = getContent.content[0];

$scope.headshot = content.header.headshot || "images/rs-photo-v1.jpg";

$scope.name = "Alex Miklovic";
$scope.position = content.header.tagline;
$scope.age = content.header.age;
$scope.email = content.header.email;
$scope.phone = content.header.phone;

$scope.intro = content.header.desc;
$scope.about = content.about.desc;

$scope.skills = skills.skills;
$scope.abilities = abilities.abilities;
$scope.projects = projects.projects;

$scope.uploadPic = function(file) {
    file.upload = Upload.upload({
      url: '/uploads',
      data: {file: file},
      headers: {'Authorization': 'Bearer '+auth.getToken()}
    }).then(function(resp){
    	$scope.headshot = 'images/uploads/'+resp.data.filename;
    	$scope.updateContent();
    });
}

$scope.updateContent = function(){
	var data = [{
		header:{
			headshot: $scope.headshot,
			tagline: $scope.position,
			age: $scope.age,
			email:  $scope.email,
			phone: $scope.phone,
			desc: $scope.intro
		},
		about:{
			desc: $scope.about
		}
	}];

	getContent.update(data);
}



angular.element(document).ready(function(){

	setTimeout(function(){

		$('#profile').waypoint(function(){
		$('#profile').addClass('animated zoomIn');
		}, {offset: '200px'});

		$('#aboutsection').waypoint(function(){
			$('#aboutsection').addClass('animated fadeInUp');
		}, {offset: '80%'});

		$('#references').waypoint(function(){
			$('#references').addClass('animated fadeInUp');
		}, {offset: '80%'});


		var continuousElements = document.getElementsByClassName('project')
		for (var i = 0; i < continuousElements.length; i++) {
		  new Waypoint({
		    element: continuousElements[i],
		    handler: function() {
		    	console.log(this);
		      this.element.firstElementChild.className +=" animated fadeInLeft";
		      this.element.lastElementChild.className +=" animated fadeInRight";
		    },
		    offset: '80%'
		  })
		}

		var skillElements = document.querySelectorAll('.skill-block:nth-child(odd)')
		for (var i = 0; i < skillElements.length; i++) {
		  new Waypoint({
		    element: skillElements[i],
		    handler: function() {
		    	console.log(this);
		      this.element.className +=" animated fadeInLeft";
		    },
		    offset: '80%'
		  })
		}

		var skillElements = document.querySelectorAll('.skill-block:nth-child(even)')
		for (var i = 0; i < skillElements.length; i++) {
		  new Waypoint({
		    element: skillElements[i],
		    handler: function() {
		  		this.element.className +=" animated fadeInRight";
		    },
		    offset: '80%'
		  })
		}

		var skillRowElements = document.querySelectorAll('.skill-row')
		for (var i = 0; i < skillRowElements.length; i++) {
		  new Waypoint({
		    element: skillRowElements[i],
		    handler: function() {
		  		this.element.className +=" animated fadeInUp";
		    },
		    offset: '80%'
		  })
		}

	}, 10);
});


}]);