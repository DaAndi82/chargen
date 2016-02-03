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
		
		userService.modifyUser = function(user, callback) {
			if (user != null) {
				console.log('UserService: Save user with id "' + user.$id + '"');
				
				user.lastModified = Date.now();
				
				userService.firebaseArray.$save(user).then(function() {
					console.log('UserService: User with id "' + user.$id + '" saved');
					if (callback) callback();
				});
			}
		}
		
		userService.getUserList = function () {
			// return angular.copy(userService.firebaseArray);
			return userService.firebaseArray;
		}
		
		userService.deleteUser = function (id, callback) {
			if (id != null) {
				console.log('UserService: Delete user with id "' + id + '"');
				
				userService.firebaseArray.$remove(id).then(function() {
					console.log('UserService: User with id "' + id + '" deleted');
					if (callback) callback();
				});
			}
		}
		
		userService.createUser = function (user, callback) {
			if (user != null) {
				console.log('UserService: Create user with name "' + user.name + '"');
				
				user.lastModified = Date.now();
				
				userService.firebaseArray.$add(user).then(function(ref) {
					console.log('UserService: User with name "' + user.name + '" created (id: ' + ref.$id + ')');
					if (callback) callback();
				});
			}
		}
		
		/*userService.userOutOfSync = function (user) {
			var syncUser = userService.firebaseArray.$getRecord(user.$id);			
			if (syncUser.lastModified != null && user.lastModified !== syncUser.lastModified) {
				console.log('UserService: User with id "' + user.$id + '" is out of in sync');
				return true;
			} else {
				console.log('UserService: User with id "' + user.$id + '" is in sync');
				return false;
			}
		}*/
		
		return userService;
	});