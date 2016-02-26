angular.module('chargen.users', [
		'ngMessages',
		'ui.router',
		'chargen.userService',
		'chargen.alertService'
	])

	.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider.state('users', {
            url: '/users',
            templateUrl: 'pages/users.html',
			resolve: {
				"currentAuth": ["authService", function(authService) {
					return authService.auth.$requireAuth();
				}]
			}
        })
    })
	
	.controller('UsersController',  function ($scope, $rootScope, $state, userService, alertService) {
		
		/* Hält den AlertService. */
		$scope.alertService = alertService;
		/* Hält die Liste der User (nicht das FirebaseArray). */
		$scope.userList = null;
		/* EditMaskModel für die Edit-Maske */
		$scope.EditMaskModel = null;
		/* EditMaskModel für die Edit-Maske */
		$scope.DeleteUserModel = null;
		/* Triggert die Loading-Animation .*/
		$scope.showUserlistLoading = true;
		/* Triggert in der EditMask den Create-Mode.*/
		$scope.showEditMaskCreate = false;
		/* Triggert in der EditMask den Edit-Mode.*/
		$scope.showEditMaskEdit = false;
		/* Triggert das DeleteUserWarning .*/
		$scope.showDeleteUserWarning = false;
		
		
		$scope.init = function () {
			$rootScope.loadUserlist = $scope.loadUserlist;
			$scope.loadUserlist();
		}
		
		
		$scope.loadUserlist = function () {
			$scope.showUserlistLoading = true;
		
			/* Initalisierung des UserService */			
			userService.init(function () {
				$scope.userList = userService.getUserList();
				$scope.showUserlistLoading = false;
			});
		}
		
		
		$scope.editUser = function (id) {
			$scope.EditMaskModel = {user: userService.getUser(id), password: null, confirmPassword: null};
			if ($scope.EditMaskModel.user != null) {				
				$scope.showEditMaskCreate = false;
				$scope.showEditMaskEdit = true;
			}
		}
		
		
		$scope.deleteUser = function (id) {
			$scope.DeleteUserModel = userService.getUser(id);
			if ($scope.DeleteUserModel != null) {
				$scope.showDeleteUserWarning = true;
			}
		}
		
		
		$scope.newUser = function () {
			$scope.EditMaskModel = {user: null, password: null, confirmPassword: null};
			$scope.showEditMaskCreate = true;
			$scope.showEditMaskEdit = false;
		}
		
		
		$scope.cancelEditing = function (form) {
			$scope.EditMaskModel = null;
			$scope.closeAndResetEditForm(form);
			$scope.loadUserlist();
		}
		
		$scope.cancelDeleting = function () {
			$scope.closeDeleteAlert();
			$scope.showDeleteUserWarning = false;
			$scope.DeleteUserModel = null;
		}		
		
		$scope.saveUser = function (form) {			
			$scope.showUserlistLoading = true;
			$scope.EditMaskModel.initiator = $rootScope.profil.$id;
			
			userService.modifyUser($scope.EditMaskModel, function(error) {
				$scope.showUserlistLoading = false;
				
				if (!error) {
					// Show alert
					alertService.addAlert({
						type: 'success',
						text: 'Der User mit der E-Mail "' + $scope.EditMaskModel.user.email + '" wurde aktuallisiert.'
					});
				
					// Reset EditMask.
					$scope.closeAndResetEditForm(form);
					$scope.EditMaskModel = null;
				} else {
					switch (error.code) {
						default:
							alertService.addAlert({
								scope: 'editMaskScope',
								type: 'error',
								text: 'Es ist ein Fehler aufgetreten (Error-Code: ' + error.code + ').'
							});
						break;
					}
				}
			});
		}
		
		
		$scope.createUser = function (form) {			
			$scope.showUserlistLoading = true;
			$scope.EditMaskModel.initiator = $rootScope.profil.$id;
			
			userService.createUserWithAuth($scope.EditMaskModel, function(error) {
				$scope.showUserlistLoading = false;
				
				if (!error) {
					// Show alert
					alertService.addAlert({
						type: 'success',
						text: 'Der User mit der E-Mail "' + $scope.EditMaskModel.user.email + '" wurde erfolgreich angelegt.'
					});
					
					// Reset EditMask.
					$scope.closeAndResetEditForm(form);
					$scope.EditMaskModel = null;
				} else {
					switch (error.code) {
						case 'EMAIL_TAKEN':
							alertService.addAlert({
								scope: 'editMaskScope',
								type: 'error',
								text: 'Die E-Mail ist bereist vergeben.'
							});
						break;
						
						default:
							alertService.addAlert({
								scope: 'editMaskScope',
								type: 'error',
								text: 'Es ist ein Fehler aufgetreten (Error-Code: ' + error.code + ').'
							});
						break;
					}
				}
			});
		}
		
		
		$scope.removeUser = function () {
			$scope.showUserlistLoading = true;
			
			userService.removeUser($scope.DeleteUserModel, function(error) {
				
				$scope.showUserlistLoading = false;
				
				if (!error) {
					alertService.addAlert({
						type: 'success',
						text: 'User wurde erfolgreich angelegt.'
					});
				} else {
					alertService.addAlert({
						type: 'error',
						text: 'Es ist ein Fehler aufgetreten. Der User mit der E-Mail "' + $scope.DeleteUserModel.email + '" konnte nicht gelöscht werden'
					});
				}
				
				$scope.closeDeleteAlert();
				$scope.DeleteUserModel = null;
			});
		}
		
		
		$scope.closeAndResetEditForm = function (form) {
			$('#EditMaskModel-modal').modal('hide');
			form.$setUntouched();
			form.$setPristine();
		}
		
		
		$scope.closeDeleteAlert = function () {
			$('#delete-modal').modal('hide');
		}
		
		
		$scope.init();		
	});