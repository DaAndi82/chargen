angular.module('chargen.authService',[
		'firebase'
	])

    .factory('authService', function($firebaseAuth) {
	
		var authService = this;
		authService.auth = $firebaseAuth(new Firebase('https://chargen.firebaseio.com/'));
		
		return authService;
    });