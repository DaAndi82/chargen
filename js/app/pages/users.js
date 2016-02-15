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
		/* Triggert die Loading-Animation .*/
		$scope.showUserlistLoading = true;
		/* Triggert die EditMask .*/
		$scope.showEditMask = false;
		/* Triggert in der EditMask den Create-Mode.*/
		$scope.showEditMaskCreate = false;
		/* Triggert in der EditMask den Edit-Mode.*/
		$scope.showEditMaskEdit = false;
		/* Triggert in der EditMask den Edit-Mode.*/
		$scope.showErrorMessages = true;
		
		
		$scope.init = function () {
			$scope.loadUserlist();
		}
		
		
		$scope.loadUserlist = function () {
			$scope.showUserlistLoading = true;		
			$scope.userList = $scope.userService.getUserList();
			$scope.showUserlistLoading = false;
				
			/* Initalisierung des UserService */			
			/*$scope.userService.init(function () {
				$scope.userList = $scope.userService.getUserList();
				$scope.showUserlistLoading = false;
			});*/
		};
		
		
		$scope.editUser = function (id) {
			$scope.EditMaskModel = {user: $scope.userService.getUser(id)};
			if ($scope.EditMaskModel.user != null) {				
				$scope.showEditMaskCreate = false;
				$scope.showEditMaskEdit = true;
				$scope.showEditMask = true;
				$scope.showErrorMessages = false;
			}
		}
		
		
		$scope.deleteUser = function (id) {
			$scope.showUserlistLoading = true;
			
			$scope.userService.deleteUser(id, function(error) {
				//$scope.updateUserlist();
				$scope.showUserlistLoading = false;
			});
		}
		
		
		$scope.newUser = function () {
			$scope.EditMaskModel = null;
			$scope.showEditMaskCreate = true;
			$scope.showEditMaskEdit = false;
			$scope.showEditMask = true;
			$scope.showErrorMessages = false;
		}
		
		
		$scope.cancelEditing = function (form) {
			$scope.EditMaskModel = null;
			$scope.showEditMask = false;
			$scope.closeAndResetForm(form);
			$scope.showErrorMessages = true;
			$scope.loadUserlist();
		}
		
		
		$scope.saveUser = function (form) {			
			$scope.showUserlistLoading = true;
			
			$scope.userService.modifyUser($scope.EditMaskModel, function(error) {
				//$scope.updateUserlist();
				$scope.showUserlistLoading = false;
				
				// Reset EditMask.
				$scope.EditMaskModel = null;
				$scope.showEditMask = false;
				$scope.closeAndResetForm(form);
				$scope.showErrorMessages = true;
				
				// Show alert
				$scope.alertService.addAlert('userScope', 'success', 'User wurde aktuallisiert.');
			});
		}
		
		
		$scope.createUser = function (form) {			
			$scope.showUserlistLoading = true;
			
			$scope.userService.createUser($scope.EditMaskModel, function(error) {
				
				if (!error) {
					$scope.showUserlistLoading = false;
					
					// Reset EditMask.
					$scope.EditMaskModel = null;
					$scope.showEditMask = false;
					$scope.closeAndResetForm(form);
					$scope.showErrorMessages = true;
					
					// Show alert
					$scope.alertService.addAlert('userScope', 'success', 'User wurde erfolgreich angelegt.');
				} else {
					// TODO: Fehlerfall,... Error-Message ausgeben.
					switch (error.code) {
						case 'EMAIL_TAKEN':
							$scope.alertService.addAlert('editMaskScope', 'error', 'Die E-Mail ist bereist vergeben.');
						break;
					}
				}
			});
		}
		
		
		$scope.closeAndResetForm = function (form) {			
			$('#EditMaskModel-modal').modal('hide');
			form.$setUntouched();
			form.$setPristine();
		}
		
		
		/*$scope.updateUserlist = function () {
			console.log('Update userlist');
			$scope.userList = $scope.userService.getUserList();
		}*/
		
		
		$scope.init();		
	});