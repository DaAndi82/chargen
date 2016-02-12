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
	
	
	.controller('ChargenController',  function ($rootScope, $scope, $state, Auth, userService) {
		
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
		
		
		$scope.login = function (email, password, remember_me) {
			console.log("ChargenController: User versucht sich anzumelden.");
			
			Auth.$authWithPassword({ email: email, password: password }, { rememberMe: remember_me ? "default" : "none"})
				.then(function(user) {
					console.log("ChargenController: User angemeldet");
					//$rootScope.user = userService.getUserByUID (user.uid);
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
	})
	
	.run(function($rootScope, $state, Auth, $timeout) {
		// track status of authentication
		/*Auth.$onAuth(function(user) {
			console.log('Run: LoggedIn: ' + !!user);
			$rootScope.loggedIn = !!user;
			
			if (!$rootScope.loggedIn) {
				$state.go('login');
			}
		});*/
		
		$rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
			// We can catch the error thrown when the $requireAuth promise is rejected
			// and redirect the user back to the home page
			if (error === "AUTH_REQUIRED") {
				$state.go("login");
				$state.reload();
			}
		});
		
		// Damit  der Body erst nach der Initialisierung von Angular angezeigt wird.
		// Verhindert flackern der Login/Registrierungs-Boxen.
		$timeout(function() {
			angular.element(document.body).removeClass('ng-hide');
		}, 500);
	});
 
    /*.value('fbURL', 'https://chargen.firebaseio.com/')
    .service('fbRef', function(fbURL) {
        return new Firebase(fbURL)
    })*/