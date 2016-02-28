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