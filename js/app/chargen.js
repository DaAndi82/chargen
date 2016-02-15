angular.module('chargen', [
        'ui.router',
        'chargen.overview',
        'chargen.users',
		'chargen.userService',
		'chargen.auth'
    ])
	
    
	.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/overview');
		$stateProvider
			.state('login', {
				url: '/login'
			})
			.state('registration', {
				url: '/registration',
			});
	})
	
	
	.controller('ChargenController',  function ($rootScope, $scope, $state, $timeout, Auth, userService) {
		
		$scope.showChargen = function () {
			if ($state.is('login') || $state.is('registration')) {
				return false;
			}
			return true;
		}
		
		$scope.showLogin = function () {
			if ($state.is('login')) {
				return true;
			}
			return false;
		}
		
		$scope.showRegistration = function () {
			if ($state.is('registration')) {
				return true;
			}
			return false;
		}
		
		
		$scope.init = function () {
			// Service-Initialisition
			userService.init(function() {
				// User aus Auth zuweisen
				var authData = Auth.$getAuth();
				if (authData) {
					console.log('ChargenController - Init: User zuweisen.')
					$rootScope.user = userService.getUserByUID (authData.uid);
				}
				
				// Damit  der Body erst nach der Initialisierung von Angular angezeigt wird.
				// Verhindert flackern der Login/Registrierungs-Boxen.
				$timeout(function() {
					angular.element(document.body).removeClass('ng-hide');
				}, 500);
			});
		}
		
		
		$scope.login = function (email, password, remember_me) {
			console.log("ChargenController: User versucht sich anzumelden.");
			
			Auth.$authWithPassword({ email: email, password: password }, { rememberMe: remember_me ? "default" : "none"})
				.then(function(user) {
					console.log("ChargenController: User angemeldet");
					$rootScope.user = userService.getUserByUID (user.uid);
					$state.go('overview');
				}, function(err) {
					if (angular.isObject(err) && err.code) {
						console.log(err.code);
					} else {
						console.log("ChargenController: Fehler bei der Anmeldung.");
					}
				}
			);
		}
		
		
		$scope.logout = function () {
			console.log("ChargenController: User meldet sich ab.");
			
			Auth.$unauth();
			$state.go('login');
		}
		
		
		$scope.init()
	})
	
	.run(function($rootScope, $state, Auth, $timeout, userService) {		
		$rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
			// We can catch the error thrown when the $requireAuth promise is rejected
			// and redirect the user back to the home page
			if (error === "AUTH_REQUIRED") {
				$state.go("login");
				$state.reload();
			}
		});
	});
 
    /*.value('fbURL', 'https://chargen.firebaseio.com/')
    .service('fbRef', function(fbURL) {
        return new Firebase(fbURL)
    })*/