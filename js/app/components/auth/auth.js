angular.module('chargen.auth',[
		'firebase'
	])

    .factory('Auth', function($firebaseAuth) {
        return $firebaseAuth(new Firebase('https://chargen.firebaseio.com/'));
    });
	
	/*angular.module('chargen.auth',[
		'firebase',
		'firebase.utils'
	])

    .factory('Auth', function($firebaseAuth, fbutil) {
        return $firebaseAuth(fbutil.ref());
    });*/