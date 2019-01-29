app.controller('messagesCtrl', ['$scope', 'messages', 'userInfo', 'auth', 'mail', function($scope, messages, userInfo, auth, mail){
	$scope.messages = messages.messages;
	$scope.messageBody = "";
	//$scope.isAdmin = auth.isAdmin;

	$scope.selectedUser= "";

	$scope.users = userInfo.allUsers;

	$scope.addMessage = function(){
		var message = {};
		if (auth.isAdmin()==true){
			message.To = $scope.selectedUser;
		}
		else {
			message.To = "awmiklovic@gmail.com"
		}

		message.From = auth.currentUser();
		message.message = $scope.messageBody;
		messages.create(message).then(function(){
			mail.send({
	      		recipient: message.To,
	      		subject: "You have recieved a message!",
	      		message: message.From + " sent you a message:\n\n" + $scope.messageBody
      		});
			$scope.messageBody = "";
		});
	}


}]);

app.factory('messages', ['$http', 'auth', function($http, auth){

	var m = {
		messages : []
	};

	m.getAll = function(){
		return $http.get('/messages/'+auth.currentUser(), { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
			angular.copy(data, m.messages);
		});
	}

	m.create = function(message){
		return $http.post('/messages/'+message.To, message, { headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
			m.messages.push(data);
		});
	};

	return m;


}]);

