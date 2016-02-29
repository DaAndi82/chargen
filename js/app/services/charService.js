angular.module('chargen.charService', [
		'firebase',
		'ngFileUpload',
		'chargen.authService'
	])

	.factory('charService', function ($rootScope, $firebaseArray, Upload, authService) {
		
		var charService = this;
		charService.firebaseArray = null;
		
		
		charService.init = function (callback) {
			console.log('CharService: Loading chars');
			
			var firebaseRef = new Firebase('https://chargen.firebaseio.com/chars')
				.orderByChild('dataCreator')
				.equalTo($rootScope.profil.$id);
			
			charService.firebaseArray = $firebaseArray(firebaseRef);
			charService.firebaseArray.$loaded()
				.then(function () {
					console.log('CharService: Chars loaded');
					if (callback) callback();
				});	
		}
		
		
		charService.getCharList = function () {			
			return charService.firebaseArray;
		}
		
		
		charService.getChar = function (id) {
			var char = charService.firebaseArray.$getRecord(id);
				if (char != null) {
					console.log('CharService: Char with id "' + id + '" founded');
				} else {
					console.log('CharService: No char with id "' + id + '" founded');
				}
			return char;
		}
		
		
		charService.createChar = function (charModel, callback) {
			if (charModel != null) {
				console.log('CharService: Create char with name "' + charModel.char.name + '"');
				
				charService.signTransaction(charModel.char, charModel.initiator, true);
			
				charService.firebaseArray.$add(charModel.char).then(function(ref) {
					console.log('CharService: Char with name "' + charModel.char.name + '" created (id: ' + ref.key() + ')');					
					if (callback) callback(null);
				});
			}
		}
		
		
		charService.modifyChar = function(charModel, callback) {
		
			if (charModel != null) {
				console.log('CharService: Save char with id "' + charModel.char.$id + '"');
				
				charService.signTransaction(charModel.char, charModel.initiator, false);
				
				charService.firebaseArray.$save(charModel.char)
				.then(function() {
					console.log('CharService: Char with id "' + charModel.char.$id + '" saved');
					if (callback) callback(null);
				})
				.catch (function(error) {
					console.log('CharService: Could not modfy char with id "' + charModel.char.$id + '" (' + error.code + ')');
					if (callback) callback(error);
				});
			}
		}
		
		
		charService.removeChar = function (char, callback) {
			if (char != null) {
				console.log('CharService: Delete char with id "' + char.$id + '"');			
				
				charService.firebaseArray.$remove(char).then(function(ref) {
					if (ref.key() === char.$id) {
						console.log('CharService: Char with id "' + char.$id + '" deleted');
						if (callback) callback(null);
					} else {
						console.log('CharService: Could not delete char with id "' + char.$id + '"');
						if (callback) callback(true);
					}
				});
			}
		}
		
		
		charService.signTransaction = function (char, initiator, isCreation) {
			var now = Date.now();
			
			char.dataLastModified = now;
			char.dataLastModifier = initiator;
			
			if (isCreation) {
				char.dataCreation = now;
				char.dataCreator = initiator;
			}
		}
		
		
		return charService;
	});