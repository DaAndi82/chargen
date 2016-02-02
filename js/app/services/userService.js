angular.module('chargen.userService', [
		'firebase'
	])

	.factory('userService', function ($firebaseArray) {
		
		var userService = this;
		userService.firebaseArray = null;
		
		userService.init = function (callback) {
			console.log('UserService: Loading users');
			
			userService.firebaseArray = $firebaseArray(new Firebase('https://chargen.firebaseio.com/users'));			
			userService.firebaseArray.$loaded()
				.then(function () {
					console.log('UserService: Users loaded');
					if (callback) callback();
				});
		}
		
		userService.getUser = function (id) {
			var user = userService.firebaseArray.$getRecord(id);
				if (user != null) {
					console.log('UserService: User with id "' + id + '" founded');
				} else {
					console.log('UserService: No user with id "' + id + '" founded');
				}
			return user;
		}
		
		userService.saveUser = function(user, callback) {
			if (user != null) {
				console.log('UserService: Save user with id "' + user.$id + '"');
				
				userService.firebaseArray.$save(user).then(function() {
					console.log('UserService: User with id "' + user.$id + '" saved');
					if (callback) callback();
				});
			}
		}
		
		userService.getUserList = function () {
			return angular.copy(userService.firebaseArray);
		}
		
		return userService;
	});