angular.module('users', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/users', {
			templateUrl: 'pages/users.html',
			controller: 'UsersController as uc'
		});
    }])
	
	.controller('UsersController', ['$scope', function ($scope) {
		
		$scope.users = [
			{id: 1, name: 'Da.Andi', email: 'Da.Andi@web.de'},
			{id: 2, name: 'Da.Andi2', email: 'Da.Andi2@web.de'}
		];
		
		
		$scope.deleteUser = function (index) {
			var usersTemp = $scope.users;
			
			usersTemp.splice(index, 1);
		}
	}])
	
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
	
	
    