app.factory('getContent', function($http, auth){

	var c = {
		content: []
	}

	c.getAll = function(){
		return $http.get('/home/').success(function(data){
			angular.copy(data, c.content);
		});
	}

	c.update = function(data){
		return $http.put('/home/', data[0], { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(returndata){
			angular.copy(returndata, c.content);
		});
	}

	return c;

});