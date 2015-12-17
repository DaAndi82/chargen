angular.module('users', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/users', {
			templateUrl: 'pages/users.html',
			controller: 'UsersController as uc'
		});
    }])
	
	.controller('UsersController', function () {
		
		var usersControler = this;
		
		usersControler.users = [
			{name: 'Da.Andi', email: 'Da.Andi@web.de'},
			{name: 'Da.Andi2', email: 'Da.Andi2@web.de'}
		];
	});