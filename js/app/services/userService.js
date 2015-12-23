angular.module('chargen.userService', [
		'firebase'
	])

	.factory('userService', function ($firebaseArray) {
		
		var userService = this;		
		userService.users = null;		
		
		userService.loadUsers = function (callback) {
			console.log('UserService: Loading users');
			
			var users = $firebaseArray(new Firebase('https://chargen.firebaseio.com/users'));
			users.$loaded()
				.then(function (loadedUsers) {
					userService.users = loadedUsers;
					
					console.log('UserService: Users loaded');
					if (callback) callback();
				});
		}
		
		return userService;
	});