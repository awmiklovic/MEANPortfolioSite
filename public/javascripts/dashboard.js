app.controller('dashboardCtrl', [
	'$scope',
	'auth',
	'mail',
	'$http',
	function($scope, auth, mail, abilities, $http){

		$scope.interview = "";

		$scope.isLoggedIn = auth.isLoggedIn;

		$scope.isAdmin = auth.isAdmin();

		$scope.role="admin";


		$scope.addMessage = function(){
			$scope.messages.push({user:$scope.profile.displayName, body:$scope.messageBody});
			mail.send({
				recipient:"alex@brunch.digital",
				subject:"You have recieved a new message",
				message:$scope.profile.displayName + " sent you a new message:\n\n" + $scope.messageBody
			});
			$scope.messageBody = "";

		};

		angular.element(document).ready(function(){
			var height = $('ul.messages')[0].scrollHeight;
			$('ul.messages').scrollTop(height);
		})
	}
]);

app.controller('DatePicker', ['$scope', '$filter', '$uibModal','userInfo', 'mail', function ($scope, $filter, $uibModal, userInfo, mail) {

	var info = userInfo.user;
	$scope.email = info.email;

  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function() {
    $scope.dt = null;
  };

  $scope.options = {
    customClass: getDayClass,
    minDate: new Date()
  };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $scope.toggleMin = function() {
    $scope.options.minDate = $scope.options.minDate ? null : new Date();
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date(tomorrow);
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }


	$scope.open = function () {
		var modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'myModalContent.html',
			controller: 'ModalInstanceCtrl',
			controllerAs: '$ctrl',
			resolve: {
				date: function () {
				  return $scope.dt;
				},
				time: function(){
					return $scope.mytime;
				}
			}
		});

		modalInstance.result.then(function (object) {
	      	$scope.interview = object[0];
	      	$scope.interview = $filter('date')($scope.interview, 'fullDate');
	      	$scope.interviewTime = object[1];
	      	$scope.interviewTime = $filter('date')(object[1], 'hh:mm:a');

	      	mail.send({
	      		recipient: "alex@brunch.digital",
	      		subject: "You have an interview request!",
	      		message: "You have been summoned for an interview on:\n\n" + $scope.interview	+ "\n" + $scope.interviewTime
	      	});
    	});
	};

	$scope.editInterview= function(){
		$scope.interview = '';
	};

	var d = new Date();
	d.setHours(12);
	d.setMinutes(0);
	$scope.mytime = d;

	$scope.hstep = 1;
	$scope.mstep = 15;

	$scope.options = {
	hstep: [1, 2, 3],
	mstep: [1, 5, 10, 15, 25, 30]
	};
	$scope.ismeridian = true;

}]);


// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, date, time) {

  $scope.dt = date;
  $scope.mytime = time;

  o = [date, time];

  $scope.ok = function () {
    $uibModalInstance.close(o);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
