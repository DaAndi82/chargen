angular.module('chargen.userService', [
		'firebase',
		'chargen.auth'
	])

	.factory('userService', function ($firebaseArray, Auth) {
		
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
		
		
		userService.getUserByUID = function (uid) {			
			if (uid) {
				for (var i=0 ; i < userService.firebaseArray.length ; i++) {
					if (userService.firebaseArray[i].uid && userService.firebaseArray[i].uid === uid) {
						return userService.getUser (userService.firebaseArray[i].$id);
					}
				}
			}			
			return null;
		}
		
		
		userService.modifyUser = function(user, callback) {
			if (user != null) {
				console.log('UserService: Save user with id "' + user.$id + '"');
				
				userService.signTransaction(user, false);
				
				userService.firebaseArray.$save(user).then(function() {
					console.log('UserService: User with id "' + user.$id + '" saved');
					if (callback) callback(true);
				});
			}
		}
		
		
		userService.getUserList = function () {
			// return angular.copy(userService.firebaseArray);
			return userService.firebaseArray;
		}
		
		
		userService.deleteUser = function (id, callback) {
			if (id != null) {
				var user = userService.getUser(id);
				
				if (user != null) {
					console.log('UserService: Delete user with id "' + id + '"');			
				
					userService.firebaseArray.$remove(user).then(function() {
						console.log('UserService: User with id "' + id + '" deleted');
						if (callback) callback(true);
					});
				}
			}
		}
		
		
		userService.createUser = function (user, callback) {
			if (user != null) {
				console.log('UserService: Create user with name "' + user.name + '"');
				
				Auth.$createUser({
					email: user.email,
					password: user.password				
				}).then ( function (userData) {
					console.log ('UserService: FirebaseUser created with uid "' + userData.uid + '"')
					user.uid = userData.uid;
					userService.signTransaction(user, true);
				
					userService.firebaseArray.$add(user).then(function(ref) {
						console.log('UserService: User with name "' + user.name + '" created (id: ' + ref.$id + ')');
						if (callback) callback(true);
					});				
				}).catch ()
			}
		}
		
		
		userService.signTransaction = function (user, isCreation) {
			var now = Date.now();
			
			user.dataLastModified = now;
			user.dataLastModifier = "Da.Andi";
			
			if (isCreation) {
				user.dataCreation = now;
				user.dataCreator = "Da.Andi";
			} else {
				if (user.dataCreation == null) user.dataCreation = now;
				if (user.dataCreator == null) user.dataCreator = "Da.Andi";;
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