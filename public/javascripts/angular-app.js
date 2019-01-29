var app = angular.module('resumeApp', ['ui.router', 'ngFileUpload', 'ui.bootstrap', 'xeditable', 'slick', 'smoothScroll']);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/views/home.html',
			controller: 'MainCtrl',
			resolve: {
				contentPromise: ['getContent', function(getContent){
					return getContent.getAll();
				}],
				skillsPromise: ['skills', function(skills){
					return skills.getAll();
				}],
				abilitiesPromise: ['abilities', function(abilities){
					return abilities.getAll();
				}],
				projectsPromise: ['projects', function(projects){
					return projects.getAll();
				}],
				testimonialPromise: ['testimonials', function(testimonials){
					return testimonials.getApproved();
				}]
			}
		})
		.state('posts', {
			url: '/posts/{id}',
			templateUrl: '/views/posts.html',
			controller: 'PostsCtrl',
			resolve: {
    			post: ['$stateParams', 'posts', function($stateParams, posts){
    				return posts.get($stateParams.id);
    			}]
  			}
		})
		.state('/register', {
			url: '/register',
			templateUrl: '/views/register.html',
			controller: 'AuthCtrl',
			onEnter: ['$state', 'auth', function($state, auth){
				if (auth.isLoggedIn()) $state.go('home');
			}]
		})
		.state('/login', {
			url: '/login',
			templateUrl: '/views/login.html',
			controller: 'AuthCtrl',
			onEnter: ['$state', 'auth', function($state, auth){
				if (auth.isLoggedIn()) $state.go('home');
			}]
		})
		.state('/dashboard', {
			url: '/dashboard',
			templateUrl: '/views/dashboard.html',
			controller: 'dashboardCtrl',
			resolve: {
				skillPromise: ['skills', function(skills){
					return skills.getAll();
				}],
				abilitiesPromise: ['abilities', function(abilities){
					return abilities.getAll();
				}],
				projectsPromise: ['projects', function(projects){
					return projects.getAll();
				}],
				userPromise: ['userInfo', function(userInfo){
					return userInfo.getAll();
				}],
				testimonialPromise: ['testimonials', function(testimonials){
					return testimonials.getUnapproved();
				}],
				messagePromise: ['messages', function(messages){
					return messages.getAll();
				}],
				UsersPromise: ['userInfo', function(userInfo){
					return userInfo.getAllUsers();
				}]
			}
		});

		$urlRouterProvider.otherwise('home');
	}
]);

app.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

app.controller('NavCtrl', ['$scope', 'auth', '$state', function($scope, auth, $state){
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.currentUser = auth.currentUser;
	$scope.logOut = auth.logOut;

	$scope.logoLight = "/images/logoLight.png";
	$scope.logoDark = "/images/logoDark.png";


	$scope.goHome = function(){
			$state.go('home');
	}

	$scope.goDash = function(){
			$state.go('/dashboard');
	}

	angular.element(document).ready(function(){

		var containerTop = $('.container').offset().top;

		$(window).scroll(function(){
			if ($(window).scrollTop()>250){
				$('.head-bar').addClass('head-sticky');
				$('.container').offset({top:containerTop});
				$('img.am-logo.light').hide();
				$('img.am-logo.dark').show();
			}
			else{
				$('.head-bar').removeClass('head-sticky');
				$('img.am-logo.light').show();
				$('img.am-logo.dark').hide();
				$('.container').offset({top: containerTop});
			}
		});
	});

}]);

app.controller('wrapCtrl', ['$scope', function($scope){
	$scope.headerbg = "https://hd.unsplash.com/photo-1461749280684-dccba630e2f6";
}])



app.directive('profile', function(){
	return {
		templateUrl: '/views/profile.html'
	};
});

app.directive('about', function(){
	return {
		templateUrl: '/views/about.html'
	};
});

app.directive('tech', function(){
	return {
		templateUrl: '/views/tech.html'
	};
});

app.directive('skills', function(){
	return {
		templateUrl: '/views/skill.html'
	};
});

app.directive('abilities', function(){
	return {
		templateUrl: '/views/abilities.html'
	};
});

app.directive('projects', function(){
	return {
		templateUrl: '/views/projects.html'
	};
});

app.directive('references', function(){
	return {
		templateUrl: '/views/references.html'
	};
});