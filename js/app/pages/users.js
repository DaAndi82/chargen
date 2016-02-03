angular.module('chargen.users', [
		'ngRoute',
		'chargen.userService'
	])

	.config(function($routeProvider) {
        $routeProvider.when('/users', {
			templateUrl: 'pages/users.html'
		});
    })
	
	.controller('UsersController',  function ($scope, userService) {
		
		/* Hält den UserService. */
		$scope.userService = userService;
		/* Hält die Liste der User (nicht das FirebaseArray). */
		$scope.userList = null;
		/* Triggert die Loading-Animation .*/
		$scope.showUserlistLoading = true;
		
		/* EditMaskModel für die Edit-Maske */
		$scope.EditMaskModel = {
			$id: false,
			name: '',
			email: '',
			lastModified: 0
		}
		
		$scope.loadUserlist = function () {
			$scope.showUserlistLoading = true;
		
			/* Initalisierung des UserService */			
			$scope.userService.init(function () {
				$scope.userList = $scope.userService.getUserList();
				$scope.showUserlistLoading = false;
			});
		};
		
		$scope.deleteUser = function (id) {
			$scope.showUserlistLoading = true;
			
			$scope.userService.deleteUser(id, function() {
				$scope.updateUserlist();
				$scope.showUserlistLoading = false;
			});
		}
		
		$scope.editUser = function (id) {
			$scope.EditMaskModel = $scope.userService.getUser(id);
		}
		
		$scope.saveUser = function () {			
			$scope.showUserlistLoading = true;
			
			$scope.userService.modifyUser($scope.EditMaskModel, function() {
				//$scope.updateUserlist();
				$scope.showUserlistLoading = false;
				
				// Reset EditMask.
				$scope.EditMaskModel = {
					$id: false,
					name: '',
					email: '',
					lastModified: 0
				}
			});
		}
		
		$scope.updateUserlist = function () {
			console.log('Update userlist');
			$scope.userList = $scope.userService.getUserList();
		}
		
		$scope.loadUserlist();		
	});