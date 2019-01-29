app.controller('abilitiesCtrl', ['$scope', 'abilities', function($scope, abilities){
	
	$scope.abilities = abilities.abilities;

	$scope.createAbility = function(){
		abilities.create({
			name : $scope.name,
			desc: $scope.desc
		});
		$scope.name="";
		$scope.desc="";
	};

	$scope.deleteAbility = function(id){
		abilities.delete(id);
	}

}]);

app.factory('abilities', ['$http', 'auth', function($http, auth){

	var a = {
		abilities : []
	};

	a.getAll = function(){
		return $http.get('/ability').success(function(data){
			angular.copy(data, a.abilities);
		});
	}

	a.create = function(ability){
		return $http.post('/ability', ability, { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
			a.abilities.push(data);
		});
	};

	a.delete = function(id) {
		return $http.delete('/ability/' + id, { headers: {Authorization: 'Bearer '+auth.getToken()}}).then(function(){
			a.getAll();
		});
	};

	return a;


}]);