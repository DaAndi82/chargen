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
				"currentAuth": ["Auth", function(Auth) {
					return Auth.$requireAuth();
				}]
			}
        })
    })
	
	.controller('UsersController',  function ($scope, $rootScope, $state, userService, alertService) {
		
		/* Hält den UserService. */
		$scope.userService = userService;
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
		/* Triggert die EditMask .*/
		$scope.showEditMask = false;
		/* Triggert in der EditMask den Create-Mode.*/
		$scope.showEditMaskCreate = false;
		/* Triggert in der EditMask den Edit-Mode.*/
		$scope.showEditMaskEdit = false;
		/* Triggert das DeleteUserWarning .*/
		$scope.showDeleteUserWarning = false;
		
		
		$scope.init = function () {
			$scope.loadUserlist();
		}
		
		
		$scope.loadUserlist = function () {
			$scope.showUserlistLoading = true;		
			$scope.userList = $scope.userService.getUserList();
			$scope.showUserlistLoading = false;
		};
		
		
		$scope.editUser = function (id) {
			$scope.EditMaskModel = {user: $scope.userService.getUser(id), password: null, confirmPassword: null};
			if ($scope.EditMaskModel.user != null) {				
				$scope.showEditMaskCreate = false;
				$scope.showEditMaskEdit = true;
				$scope.showEditMask = true;
			}
		}
		
		
		$scope.deleteUser = function (id) {
			$scope.DeleteUserModel = $scope.userService.getUser(id);
			if ($scope.DeleteUserModel != null) {
				$scope.showDeleteUserWarning = true;
			}
		}
		
		
		$scope.newUser = function () {
			$scope.EditMaskModel = {user: null, password: null, confirmPassword: null};
			$scope.showEditMaskCreate = true;
			$scope.showEditMaskEdit = false;
			$scope.showEditMask = true;
		}
		
		
		$scope.cancelEditing = function (form) {
			$scope.EditMaskModel = null;
			$scope.showEditMask = false;
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
			
			$scope.userService.modifyUser($scope.EditMaskModel, function(error) {
				$scope.showUserlistLoading = false;
				
				if (!error) {
					// Show alert
					$scope.alertService.addAlert({
						type: 'success',
						text: 'Der User mit der E-Mail "' + $scope.EditMaskModel.user.email + '" wurde aktuallisiert.'
					});
				
					// Reset EditMask.
					$scope.closeAndResetEditForm(form);
					$scope.showEditMask = false;
					$scope.EditMaskModel = null;
				} else {
					switch (error.code) {
						default:
							$scope.alertService.addAlert({
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
			
			$scope.userService.createUser($scope.EditMaskModel, function(error) {				
				$scope.showUserlistLoading = false;
				
				if (!error) {
					// Show alert
					$scope.alertService.addAlert({
						type: 'success',
						text: 'Der User mit der E-Mail "' + $scope.EditMaskModel.user.email + '" wurde erfolgreich angelegt.'
					});
					
					// Reset EditMask.
					$scope.closeAndResetEditForm(form);
					$scope.showEditMask = false;
					$scope.EditMaskModel = null;
				} else {
					switch (error.code) {
						case 'EMAIL_TAKEN':
							$scope.alertService.addAlert({
								scope: 'editMaskScope',
								type: 'error',
								text: 'Die E-Mail ist bereist vergeben.'
							});
						break;
						
						default:
							$scope.alertService.addAlert({
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
			
			$scope.userService.removeUser($scope.DeleteUserModel, function(error) {
				
				$scope.showUserlistLoading = false;
				
				if (!error) {
					$scope.alertService.addAlert({
						type: 'success',
						text: 'Der User mit der E-Mail "' + $scope.DeleteUserModel.email + '" wurde erfolgreich gelöscht.'
					});
				} else {
					$scope.alertService.addAlert({
						type: 'error',
						text: 'Es ist ein Fehler aufgetreten. Der User mit der E-Mail "' + $scope.DeleteUserModel.email + '" konnte nicht gelöscht werden.'
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