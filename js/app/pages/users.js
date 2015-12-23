angular.module('chargen.users', [
		'ngRoute',
		'firebase'
	])

	.config(function($routeProvider) {
        $routeProvider.when('/users', {
			templateUrl: 'pages/users.html'
		});
    })
	
	.controller('UsersController',  function ($scope, $firebaseArray) {
		
		$scope.users = $scope.users || $firebaseArray(new Firebase('https://chargen.firebaseio.com/users'));
		
		/* $scope.users.$add({name: 'Da.Andi1', email: 'Da.Andi1@web.de'});
		$scope.users.$add({name: 'Da.Andi2', email: 'Da.Andi2@web.de'}); */
		
		$scope.userList = $scope.users;
		
		console.log($scope.userList);
		
		
		$scope.EditMaskModel = {
			index: false,
			user: {uuid: false, name: '', email: ''}
		}
		
		
		$scope.deleteUser = function (index) {
			$scope.users.splice(index, 1);
		}
		
		$scope.showUser = function (index) {
			$scope.EditMaskModel.index = index;
			//$scope.EditMaskModel.user = angular.copy($scope.users[index]);
			$scope.EditMaskModel.user = $scope.users[index];
		}
		
		$scope.saveUser = function (index) {
			//$scope.users[index] = angular.copy($scope.EditMaskModel.user);
			$scope.users.$save($scope.EditMaskModel.user);
			
			/*var myDataRef = new Firebase('https://chargen.firebaseio.com/');
			myDataRef.push({users: $scope.users[0]});*/
			
			// Reset EditMask.
			$scope.EditMaskModel = {
				index: false,
				user: {uuid: false, name: '', email: ''}
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
	
	
    