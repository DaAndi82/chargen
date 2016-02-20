angular.module('chargen', [
		'ngMessages',
        'ui.router',
        'chargen.overview',
        'chargen.users',
		'chargen.userService',
		'chargen.authService',
		'chargen.alertService'
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
	
	
	.controller('ChargenController',  function ($rootScope, $scope, $state, $timeout, authService, userService, alertService) {
	
		/* Hält den AlertService. */
		$scope.alertService = alertService;
		/* UserProfilModel für die Profil-Maske */
		$scope.UserProfilModel = null;
		
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
				// User aus authService zuweisen
				$scope.authData = authService.auth.$getAuth();
				if ($scope.authData) {
					console.log('ChargenController - Init: User zuweisen.')
					$rootScope.profil = userService.getUserByUID ($scope.authData.uid);
				}
				
				// Damit  der Body erst nach der Initialisierung von Angular angezeigt wird.
				// Verhindert flackern der Login/Registrierungs-Boxen.
				$timeout(function() {
					angular.element(document.body).removeClass('ng-hide');
				}, 500);
			});
		}
		
		
		$scope.editProfil = function () {
			$scope.UserProfilModel = {user: $rootScope.profil, oldEmail: $scope.authData.password.email, password: null, newPassword: null, confirmNewPassword: null};
		}
		
		
		$scope.cancelEditing = function (form) {
			$scope.closeAndResetProfilForm(form);
			$scope.UserProfilModel = null;
			$rootScope.profil = userService.getUserByUID ($scope.authData.uid);
		}
		
		
		$scope.saveProfil = function (form) {
			userService.modifyUserWithAuth($scope.UserProfilModel, function(error) {
				if (!error) {
					// Login aktuallisieren
					$scope.relogin($scope.UserProfilModel);
				
					// Show alert
					$scope.alertService.addAlert({
						type: 'success',
						text: 'Dein Profil wurde aktuallisiert.'
					});
				
					// Reset EditMask.
					$scope.closeAndResetProfilForm(form);
					$scope.UserProfilModel = null;
				} else {
					switch (error.code) {
						case 'EMAIL_TAKEN':
							$scope.alertService.addAlert({
								scope: 'profileScope',
								type: 'error',
								text: 'Die E-Mail ist bereist vergeben.'
							});
						break;
						
						case 'INVALID_PASSWORD':
							$scope.alertService.addAlert({
								scope: 'profileScope',
								type: 'error',
								text: 'Das Passwort ist falsch.'
							});
						break;
						
						case undefined:
							$scope.alertService.addAlert({
								scope: 'profileScope',
								type: 'error',
								text: 'Es ist ein Fehler aufgetreten (' + error + ').'
							});
						break;
						
						default:
							$scope.alertService.addAlert({
								scope: 'profileScope',
								type: 'error',
								text: 'Es ist ein Fehler aufgetreten (Error-Code: ' + error.code + ').'
							});
						break;
					}
				}
			});
		}
		
		
		$scope.closeAndResetProfilForm = function (form) {
			$('#profil-modal').modal('hide');
			form.$setUntouched();
			form.$setPristine();
		}
		
		
		$scope.login = function (email, password, remember_me) {
			console.log("ChargenController: User versucht sich anzumelden.");
			
			authService.auth.$authWithPassword({ email: email, password: password }, { rememberMe: remember_me ? "default" : "none"})
				.then(function(user) {
					console.log("ChargenController: User angemeldet");
					$rootScope.profil = userService.getUserByUID (user.uid);
					$scope.authData = authService.auth.$getAuth();
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
		
		
		$scope.relogin = function (userModel) {
			authService.auth.$authWithPassword({
				email: userModel.user.email,
				password: userModel.password
			}, {
				rememberMe: "default"
			}).then(function(user) {
				console.log("ChargenController: User umgemeldet");
				$rootScope.profil = userService.getUserByUID (user.uid);
				$scope.authData = authService.auth.$getAuth();
			}, function(error) {
				if (angular.isObject(error) && error.code) {
					console.log('UserService: Password incorrect from FirebaseUser with id "' + userModel.user.$id + '"');
				} else {
					console.log('UserService: Unknown Error (' + error + ')');
				}
			});	
		}
		
		
		$scope.logout = function () {
			console.log("ChargenController: User meldet sich ab.");
			
			authService.auth.$unauth();
			$scope.authData = null;
			$rootScope.profil = null;
			$state.go('login');
		}
		
		
		$scope.init()
	})
	
	.run(function($rootScope, $state, authService, $timeout, userService) {		
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