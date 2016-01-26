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
		/* Triggert die Loading-Animation .*/
		$scope.showUserlistLoading = true;
		
		
		$scope.userService.loadUsers(function () {
			$scope.showUserlistLoading = false;
		});
		/* $scope.users.$add({name: 'Da.Andi1', email: 'Da.Andi1@web.de'});
		$scope.users.$add({name: 'Da.Andi2', email: 'Da.Andi2@web.de'}); */
		
	
		$scope.EditMaskModel = {
			$id: false,
			name: '',
			email: ''
		}
		
		
		$scope.deleteUser = function (index) {
			$scope.users.splice(index, 1);
		}
		
		$scope.showUser = function (id) {
			
			//$scope.EditMaskModel.index = index;
			//$scope.EditMaskModel.user = angular.copy($scope.users[index]);
			$scope.userService.users.forEach(function (user, index, userList){
				if (user.$id == id){
					console.log("Edit user " + user.$id);
					$scope.EditMaskModel = angular.copy(user);
					//$scope.EditMaskModel = user;
				}
			})			
		}
		
		$scope.saveUser = function () {
			//$scope.users[index] = angular.copy($scope.EditMaskModel.user);
			//$scope.users.$save($scope.EditMaskModel);			
			/*var myDataRef = new Firebase('https://chargen.firebaseio.com/');
			myDataRef.push({users: $scope.users[0]});*/
			
			$scope.userService.firebaseArray.$save($scope.EditMaskModel);
			
			/*$scope.userService.users.forEach(function (user, index, userList){
				if (user.$id == $scope.EditMaskModel.$id){
					console.log("Save user " + user.$id);
					userList[index] = angular.copy($scope.EditMaskModel);
				}
			})*/
			
			$scope.userService.users.$save();
			
			// Reset EditMask.
			$scope.EditMaskModel = {
				uuid: false,
				name: '',
				email: ''
			}
		}
		
		$scope.updateUserlist = function () {
			console.log('Update userlist');
			$scope.userList = angular.copy($scope.users);
		}
		
		
		
	});
	
	/*.directive('datatable', [function() {
        return {
            restrict: 'A',
			scope: {
				users: "=datatable"
			},
            link: function link(scope, element, attrs) {
				var dataTable;
				
				setTimeout(function() { 
					//element.DataTable();
				}, 0);
				
				scope.$watch('users', function() {
					
					setTimeout(function() { 
						//element.DataTable();
						console.log(scope.users);
					}, 1000);
				
				}, true);
            }
        };
    }]);*/
	
	
    