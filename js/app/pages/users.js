angular.module('chargen.users', [
		'ngRoute',
		'chargen.userService',
		'chargen.alertService'
	])

	.config(function($routeProvider) {
        $routeProvider.when('/users', {
			templateUrl: 'pages/users.html'
		});
    })
	
	.controller('UsersController',  function ($scope, userService, alertService) {
		
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
		/* Triggert in der EditMask den Create-Button.*/
		$scope.showEditMaskCreateButton = false;
		/* Triggert in der EditMask den Edit-Button.*/
		$scope.showEditMaskEditButton = false;
		
		
		$scope.loadUserlist = function () {
			$scope.showUserlistLoading = true;
		
			/* Initalisierung des UserService */			
			$scope.userService.init(function () {
				$scope.userList = $scope.userService.getUserList();
				$scope.showUserlistLoading = false;
			});
		};
		
		
		$scope.editUser = function (id) {
			$scope.EditMaskModel = $scope.userService.getUser(id);
			if ($scope.EditMaskModel != null) {				
				$scope.showEditMaskCreateButton = false;
				$scope.showEditMaskEditButton = true;
				$scope.showEditMask = true;
			}
		}
		
		
		$scope.deleteUser = function (id) {
			$scope.showUserlistLoading = true;
			
			$scope.userService.deleteUser(id, function(success) {
				//$scope.updateUserlist();
				$scope.showUserlistLoading = false;
			});
		}
		
		
		$scope.newUser = function () {
			$scope.EditMaskModel = null;
			$scope.showEditMaskCreateButton = true;
			$scope.showEditMaskEditButton = false;
			$scope.showEditMask = true;
		}
		
		
		$scope.cancelEditing = function () {
			$scope.EditMaskModel = null;
			$scope.showEditMask = false;
			$scope.loadUserlist();
		}
		
		
		$scope.saveUser = function () {			
			$scope.showUserlistLoading = true;
			
			$scope.userService.modifyUser($scope.EditMaskModel, function(success) {
				//$scope.updateUserlist();
				$scope.showUserlistLoading = false;
				
				// Reset EditMask.
				$scope.EditMaskModel = null;
				$scope.showEditMask = false;
				
				// Show alert
				$scope.alertService.addAlert('success', 'User wurde aktuallisiert.');
			});
		}
		
		
		$scope.createUser = function () {			
			$scope.showUserlistLoading = true;
			
			$scope.userService.createUser($scope.EditMaskModel, function(success) {
				//$scope.updateUserlist();
				$scope.showUserlistLoading = false;
				
				// Reset EditMask.
				$scope.EditMaskModel = null;
				$scope.showEditMask = false;
			});
		}
		
		
		/*$scope.updateUserlist = function () {
			console.log('Update userlist');
			$scope.userList = $scope.userService.getUserList();
		}*/
		
		
		$scope.loadUserlist();		
	});