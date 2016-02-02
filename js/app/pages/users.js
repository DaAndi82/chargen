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
			email: ''
		}
		
		/* Initalisierung des UserService */
		$scope.userService.init(function () {
			$scope.userList = $scope.userService.getUserList();
			$scope.showUserlistLoading = false;
		});
		
		
		$scope.deleteUser = function (index) {
			$scope.users.splice(index, 1);
		}
		
		$scope.showUser = function (id) {
			$scope.EditMaskModel = $scope.userService.getUser(id);
		}
		
		$scope.saveUser = function () {			
			$scope.showUserlistLoading = true;
			
			$scope.userService.saveUser($scope.EditMaskModel, function() {
				$scope.updateUserlist();
				$scope.showUserlistLoading = false;
				
				// Reset EditMask.
				$scope.EditMaskModel = {
					uuid: false,
					name: '',
					email: ''
				}
			});
		}
		
		$scope.updateUserlist = function () {
			console.log('Update userlist');
			$scope.userList = $scope.userService.getUserList();
		}
		
		
		
	});