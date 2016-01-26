angular.module('chargen.userService', [
		'firebase'
	])

	.factory('userService', function ($firebaseArray) {
		
		var userService = this;
		userService.firebaseArray = null;
		userService.users = null;
		
		userService.loadUsers = function (callback) {
			console.log('UserService: Loading users');
			
			userService.firebaseArray = $firebaseArray(new Firebase('https://chargen.firebaseio.com/users'));
			userService.firebaseArray.$loaded()
				.then(function (loadedUsers) {
					userService.users = loadedUsers;
					
					console.log('UserService: Users loaded');
					if (callback) callback();
				});
		}
		
		return userService;
	});