angular.module('chargen', [
        'ngRoute',
        'chargen.overview',
        'chargen.users'
    ])
    
	.config(function($routeProvider) {
		$routeProvider.otherwise({redirectTo: '/'});
	});
	
	/* .run(['$rootScope', 'Auth', function($rootScope, Auth) {
		// track status of authentication
		Auth.$onAuth(function(user) {
			$rootScope.loggedIn = !!user;
		});
	}]); */
 
    /*.value('fbURL', 'https://chargen.firebaseio.com/')
    .service('fbRef', function(fbURL) {
        return new Firebase(fbURL)
    })*/