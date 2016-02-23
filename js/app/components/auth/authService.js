angular.module('chargen.authService',[
		'firebase'
	])

    .factory('authService', function($firebaseAuth) {
	
		var authService = this;
		authService.auth = $firebaseAuth(new Firebase('https://chargen.firebaseio.com/'));
    });
	
	/*angular.module('chargen.auth',[
		'firebase',
		'firebase.utils'
	])

    .factory('Auth', function($firebaseAuth, fbutil) {
        return $firebaseAuth(fbutil.ref());
    });*/