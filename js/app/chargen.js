angular.module('chargen', [
		'ngMessages',
        'ui.router',
		'ngFileUpload',
		'ngImgCrop',
		'xeditable',
		'pascalprecht.translate',
        'chargen.overview',
        'chargen.users',
		'chargen.chars',
		'chargen.userService',
		'chargen.charService',
		'chargen.authService',
		'chargen.alertService'
    ])
	
    
	.config(function($stateProvider, $urlRouterProvider, $translateProvider) {
		$urlRouterProvider.otherwise('/overview');
		$stateProvider
			.state('login', {
				url: '/login'
			})
			.state('registration', {
				url: '/registration',
			});
			
		$translateProvider.useLoader('$translatePartialLoader', {
		  urlTemplate: 'i18n/{part}/{lang}.json'
		});
		
		$translateProvider.preferredLanguage('en');
		$translateProvider.fallbackLanguage('en');
		$translateProvider.useSanitizeValueStrategy('escape');
	})
	
	
	.controller('ChargenController',  function ($rootScope, $scope, $state, $timeout, $translate, Upload, authService, userService, alertService) {
	
		/* Hält den AlertService. */
		$scope.alertService = alertService;
		/* UserProfilModel für die Profil-Maske */
		$scope.UserProfilModel = null;
		/* UserRegisterModel für die Registrierungs-Maske */
		$scope.UserRegisterModel = null;
		/*Zeigt den Avatar-Edit-Bereich im Profil an. */
		$scope.showEditAvatar = true;
		/* Ausgewählte Sprache */
		$rootScope.selectedLanguage = 'en';

		
		$scope.state = $state;
		
		
		$rootScope.changeLanguage = function (lang) {
			console.log('ChargenController - changeLaungage: Sprache auf "' + lang + '" gestellt.');
			$rootScope.selectedLanguage = lang;
			$translate.use(lang);
		}
		
		
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
					console.log('ChargenController - Init: User zuweisen.');
					$rootScope.profil = userService.getUserByUID ($scope.authData.uid);
				} else {
					$state.go('login');
				}
				
				// Damit  der Body erst nach der Initialisierung von Angular angezeigt wird.
				// Verhindert flackern der Login/Registrierungs-Boxen.
				$timeout(function() {
					angular.element(document.body).removeClass('ng-hide');
				}, 500);
			});
		}
		
		
		$scope.editProfil = function () {
		$scope.showEditAvatar = false;
			$scope.UserProfilModel = {user: $rootScope.profil, oldEmail: $scope.authData.password.email, password: null, newPassword: null, confirmNewPassword: null, editAvatar: null, cropedAvatar: null};
		}
		
		
		$scope.editAvatar = function () {
			$scope.showEditAvatar = true;
		}
		
		
		$scope.changeAvatar = function () {
			$scope.UserProfilModel.user.avatar = $scope.UserProfilModel.cropedAvatar;
			$scope.UserProfilModel.editAvatar = null;
			$scope.showEditAvatar = false;
		}
		
		
		$scope.cancelAvatar = function () {
			$scope.UserProfilModel.editAvatar = null;
			$scope.showEditAvatar = false;
		}
		
		
		$scope.cancelEditing = function (form) {
			$scope.closeAndResetProfilForm(form);
			$scope.UserProfilModel = null;
			userService.init(function(){
				$rootScope.profil = userService.getUserByUID ($scope.authData.uid);
			});
			if ($rootScope.loadUserlist != null) $rootScope.loadUserlist();
		}
		
		
		$scope.saveProfil = function (form) {
			$scope.UserProfilModel.initiator = $scope.UserProfilModel.user.$id;
			userService.modifyUserWithAuth($scope.UserProfilModel, function(error) {
				if (!error) {
					// Login aktuallisieren
					$scope.login($scope.UserProfilModel.user.email, $scope.UserProfilModel.newPassword ? $scope.UserProfilModel.newPassword : $scope.UserProfilModel.password, true);
				
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
		
		
		$scope.resetRegistrationForm = function (form) {			
			$scope.UserRegisterModel = null;
			form.$setUntouched();
			form.$setPristine();
		}
		
		
		$scope.login = function (email, password, relogin) {
			console.log("ChargenController: User versucht sich anzumelden");
			
			authService.auth.$authWithPassword({ email: email, password: password })
				.then(function(user) {
					console.log("ChargenController: User angemeldet");
					$rootScope.profil = userService.getUserByUID (user.uid);
					$scope.authData = authService.auth.$getAuth();
					if (!relogin) $state.go('overview');
				}, function(error) {
					switch (error.code) {					
						case 'INVALID_USER':
							$scope.alertService.addAlert({
								scope: 'loginScope',
								type: 'error',
								text: 'Der Benutzer oder das Passwort ist falsch.'
							});
						break;
					
						case 'INVALID_PASSWORD':
							$scope.alertService.addAlert({
								scope: 'loginScope',
								type: 'error',
								text: 'Der Benutzer oder das Passwort ist falsch.'
							});
						break;
						
						case undefined:
							$scope.alertService.addAlert({
								scope: 'loginScope',
								type: 'error',
								text: 'Es ist ein Fehler aufgetreten (' + error + ').'
							});
						break;
						
						default:
							$scope.alertService.addAlert({
								scope: 'loginScope',
								type: 'error',
								text: 'Es ist ein Fehler aufgetreten (Error-Code: ' + error.code + ').'
							});
						break;
					}
				}
			);
		}
		
		
		$scope.register = function (form) {
			console.log("ChargenController: User versucht sich zu registrieren");
			
			userService.createUserWithAuth($scope.UserRegisterModel, function(error) {				
				if (!error) {
					console.log("ChargenController: User registriert");
					// Show alert
					alertService.addAlert({
						scope: 'registerScope',
						type: 'success',
						text: 'Sie haben sich erfolgreich registriert. Sie werden zur Anmeldung weitergeleitet.'
					});
					
					$timeout(function () {
						$state.go('login');
						$scope.resetRegistrationForm(form);
					}, 2000);					
				} else {
					switch (error.code) {
						case 'EMAIL_TAKEN':
							alertService.addAlert({
								scope: 'registerScope',
								type: 'error',
								text: 'Die E-Mail ist bereist vergeben.'
							});
						break;
						
						default:
							alertService.addAlert({
								scope: 'registerScope',
								type: 'error',
								text: 'Es ist ein Fehler aufgetreten (Error-Code: ' + error.code + ').'
							});
						break;
					}
				}
			});
		}
		
		
		$scope.resetPassword = function (email) {
			if (email) {
				console.log("ChargenController: Passwort-Reset angefordert");
				authService.auth.$resetPassword({
					email: email
				}).then(function() {
					console.log("ChargenController: Passwort an E-Mail \"" + email + "\" versendet");
					$scope.alertService.addAlert({
						scope: 'loginScope',
						type: 'info',
						text: 'Es wird versucht ihnen ein Passwort per Mail zu schicken. '
					});
				}).catch(function(error) {
					switch (error.code) {					
						case 'INVALID_USER':
							$scope.alertService.addAlert({
								scope: 'loginScope',
								type: 'info',
								text: 'Es wird versucht ihnen ein Passwort per Mail zu schicken. '
							});
						break;
						
						case undefined:
							$scope.alertService.addAlert({
								scope: 'loginScope',
								type: 'error',
								text: 'Es ist ein Fehler aufgetreten (' + error + ').'
							});
						break;
						
						default:
							$scope.alertService.addAlert({
								scope: 'loginScope',
								type: 'error',
								text: 'Es ist ein Fehler aufgetreten (Error-Code: ' + error.code + ').'
							});
						break;
					}
				});
			} else {
				alertService.addAlert({
					scope: 'loginScope',
					type: 'error',
					text: 'Bitte gib deine E-Mail an.'
				});
			
			}
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
	
	.run(function($rootScope, $state, $translate, authService, $timeout, editableOptions, userService) {		
		$rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
			// We can catch the error thrown when the $requireAuth promise is rejected
			// and redirect the user back to the home page
			if (error === "AUTH_REQUIRED") {
				$state.go("login");
				$state.reload();
			}
		});
		
		$rootScope.$on('$translatePartialLoaderStructureChanged', function () {
			$translate.refresh();
		});
		
		editableOptions.theme = 'bs3';
	});
 
    /*.value('fbURL', 'https://chargen.firebaseio.com/')
    .service('fbRef', function(fbURL) {
        return new Firebase(fbURL)
    })*/