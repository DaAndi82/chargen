angular.module('users', ['ngRoute'])

	.config(function($routeProvider) {
        $routeProvider.when('/users', {
			templateUrl: 'pages/users.html',
			controller: 'UsersController as uc'
		});
    })
	
	.controller('UsersController',  function ($scope) {
		
		$scope.users = [
			{uuid: 1, name: 'Da.Andi', email: 'Da.Andi@web.de'},
			{uuid: 2, name: 'Da.Andi2', email: 'Da.Andi2@web.de'}
		];
		
		$scope.EditMaskModel = {
			index: false,
			user: {uuid: false, name: '', email: ''}
		}
		
		
		$scope.deleteUser = function (index) {
			$scope.users.splice(index, 1);
		}
		
		$scope.showUser = function (index) {
			$scope.EditMaskModel.index = index;
			$scope.EditMaskModel.user = {};
			$scope.EditMaskModel.user.name = $scope.users[index].name;
			$scope.EditMaskModel.user.email = $scope.users[index].email;
		}
		
		$scope.saveUser = function (index) {
			$scope.users[index].name = $scope.EditMaskModel.user.name;
			$scope.users[index].email = $scope.EditMaskModel.user.email;
			
			// Reset EditMask.
			$scope.EditMaskModel = {
				index: false,
				user: {uuid: false, name: '', email: ''}
			}
		}
	})
	
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
	
	
    