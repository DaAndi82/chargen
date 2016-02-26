angular.module('chargen.userService', [
		'firebase',
		'ngFileUpload',
		'chargen.authService'
	])

	.factory('userService', function ($firebaseArray, Upload, authService) {
		
		var userService = this;
		userService.firebaseArray = null;
		userService.registeredViews = [];
		
		
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
		
		
		userService.modifyUser = function(userModel, callback) {
		
			if (userModel != null) {
				console.log('UserService: Save user with id "' + userModel.user.$id + '"');
				
				userService.signTransaction(userModel.user, userModel.initiator, false);
				
				userService.firebaseArray.$save(userModel.user)
				.then(function() {
					console.log('UserService: User with id "' + userModel.user.$id + '" saved');
					if (callback) callback(null);
				})
				.catch (function(error) {
					console.log('UserService: Could not modfy user with id "' + userModel.user.$id + '" (' + error.code + ')');
					if (callback) callback(error);
				});
			}
		}
		
		
		userService.modifyUserWithAuth = function(userModel, callback) {
		
			if (userModel != null && userModel.password != null) {
				console.log('UserService: Save User & FirebaseUser with id "' + userModel.user.$id + '"');
				
				var changeEmail = function (userModel, callback) {
					console.log('UserService: Change E-Mail from FirebaseUser with id "' + userModel.user.$id + '"');
					authService.auth.$changeEmail({
						oldEmail: userModel.oldEmail,
						newEmail: userModel.user.email,
						password: userModel.password
					}).then(function() {
						console.log('UserService: E-Mail from FirebaseUser with id "' + userModel.user.$id + '" changed to "' + userModel.user.email + '"');
						if (callback) callback(null);
					}).catch(function(error) {
						console.log('UserService: Could not change E-Mail from FirebaseUser with id "' + userModel.user.$id + '" (' + error + ')');
						if (callback) callback(error);
					});
				}
				
				var changePassword = function (userModel, callback) {
					console.log('UserService: Change Password from FirebaseUser with id "' + userModel.user.$id + '"');							
					authService.auth.$changePassword({
						email: userModel.user.email,
						oldPassword: userModel.password,
						newPassword: userModel.newPassword
					}).then(function() {
						console.log('UserService: Password from FirebaseUser with id "' + userModel.user.$id + '" successfully changed');
						if (callback) callback(null);
					}).catch(function(error) {
						console.log('UserService: Could not change Password from FirebaseUser with id "' + userModel.user.$id + '" (' + error.code + ')');
						if (callback) callback(error);
					});
				}
				
				var changeOnlyUserDetails = function (userModel, callback) {
					console.log('UserService: Prove Password from FirebaseUser with id "' + userModel.user.$id + '"');
					
					authService.auth.$authWithPassword({
						email: userModel.user.email,
						password: userModel.password
					}).then(function(user) {
						console.log('UserService: Password correct from FirebaseUser with id "' + userModel.user.$id + '"');
						if (callback) callback(null);
					}, function(error) {
						if (angular.isObject(error) && error.code) {
							console.log('UserService: Password incorrect from FirebaseUser with id "' + userModel.user.$id + '"');						
							if (callback) callback(error);
						} else {
							console.log('UserService: Unknown Error (' + error + ')');						
							if (callback) callback(error);
						}
					});
				}
				
				switch (true) {
					case userModel.oldEmail.toLowerCase() != userModel.user.email.toLowerCase() && userModel.newPassword != null:
						changeEmail(userModel, function (error) {
							if (!error) {
								changePassword(userModel, function (error) {
									if (!error) {
										userService.modifyUser(userModel, function (error) {
											if (callback) callback(error);
										});
									} else {
										if (callback) callback(error);
									}
								});
							} else {
								if (callback) callback(error);
							}
						});
					break;
					
					case userModel.oldEmail.toLowerCase() != userModel.user.email.toLowerCase():
						changeEmail(userModel, function (error) {
							if (!error) {
								userService.modifyUser(userModel, function (error) {
									if (callback) callback(error);
								});
							} else {
								if (callback) callback(error);
							}
						});
					break;
					
					case userModel.newPassword != null:
						changePassword(userModel, function (error) {
							if (!error) {
								userService.modifyUser(userModel, function (error) {
									if (callback) callback(error);
								});
							} else {
								if (callback) callback(error);
							}
						});
					break;
					
					default:
						changeOnlyUserDetails(userModel, function (error) {
							if (!error) {
								userService.modifyUser(userModel, function (error) {
									if (callback) callback(error);
								});
							} else {
								if (callback) callback(error);
							}
						});
					break;
				}
			}
		}
		
		
		userService.getUserList = function () {
			return userService.firebaseArray;
		}
		
		
		userService.removeUser = function (user, callback) {
			if (user != null) {
				console.log('UserService: Delete user with id "' + user.$id + '"');			
				
				userService.firebaseArray.$remove(user).then(function(ref) {
					if (ref.key() === user.$id) {
						console.log('UserService: User with id "' + user.$id + '" deleted');
						if (callback) callback(null);
					} else {
						console.log('UserService: Could not delete user with id "' + user.$id + '"');
						if (callback) callback(true);
					}
				});
			}
		}
		
		
		userService.createUserWithAuth = function (userModel, callback) {
			if (userModel != null) {
				console.log('UserService: Create user with name "' + userModel.user.name + '"');
				
				authService.auth.$createUser({
					email: userModel.user.email,
					password: userModel.password				
				}).then ( function (userData) {
					console.log ('UserService: FirebaseUser created with uid "' + userData.uid + '"')
					userModel.user.uid = userData.uid;
					
					// Nicht bei der Registrierung, da hier noch keine $id verfügbar ist.
					if (userModel.initiator)	userService.signTransaction(userModel.user, userModel.initiator, true);
				
					userService.firebaseArray.$add(userModel.user).then(function(ref) {
						console.log('UserService: User with name "' + userModel.user.name + '" created (id: ' + ref.key() + ')');
						
						if (!userModel.initiator) {
							var user = userService.getUser(ref.key());
							userService.signTransaction(user, user.$id, true);
							
							userService.firebaseArray.$save(user)
								.then(function() {
									console.log('UserService: User with id "' + user.$id + '" saved');
									if (callback) callback(null);
								})
								.catch (function(error) {
									console.log('UserService: Could not modfy user with id "' + user.$id + '" (' + error.code + ')');
									if (callback) callback(error);
								});
						} else {
							if (callback) callback(null);
						}
					});				
				}).catch (function (error) {
						console.log('UserService: Could not create user with name "' + userModel.user.name + '" (' + error.code + ')');
						if (callback) callback(error);
				});
			}
		}
		
		
		userService.signTransaction = function (user, initiator, isCreation) {
			var now = Date.now();
			
			user.dataLastModified = now;
			user.dataLastModifier = initiator;
			
			if (isCreation) {
				user.dataCreation = now;
				user.dataCreator = initiator;
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