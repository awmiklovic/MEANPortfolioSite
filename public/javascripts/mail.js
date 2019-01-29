app.factory('mail', ['$http', 'auth', function($http, auth){

	var m = [];

	m.send = function(mail){
		return $http.post('/mailer', mail, { headers: {Authorization: 'Bearer '+auth.getToken()}});
	};
	return m;
}]);