angular.module('chargen.chars', [
		'ui.router',
		'chargen.charService',
		'chargen.alertService'
	])

    .config(function($stateProvider, $urlRouterProvider) {
		$stateProvider.state('chars', {
            url: '/chars',
            templateUrl: 'pages/chars.html',			
			resolve: {
				"currentAuth": ["authService", function(authService) {
					return authService.auth.$requireAuth();
				}]
			}
        })
    })
	
	.controller('CharController',  function ($scope, $rootScope, $state, $translatePartialLoader, charService, alertService) {
		
		/* Hält den AlertService. */
		$scope.alertService = alertService;
		/* Neuer Char */
		$scope.newCharModel = null;
		/* DeleteCharModel für die Delete-Maske */
		$scope.DeleteCharModel = null;
		/* Triggert das DeleteCharWarning .*/
		$scope.showDeleteCharWarning = false;
		/* Triggert das Bearbeiten eines Chars .*/
		$scope.showCharEditing = false;
		/* Lädt die Lokalisation */
		$translatePartialLoader.addPart('chars');
		/* Zeige Buttons bei xeditable */
		$scope.buttons = (!/iPad|iPhone|iPod/g.test(navigator.userAgent)) ? 'no' : 'right';
		
		/* charData - dummy: Perhaps in a later Version. */
		/*$scope.charData = {
			species: {
				droid: {
					value_de: 'Droide',
					value_en: 'Droid'
				},
				human: {
					value_de: 'Mensch',
					value_en: 'Human'
				}
			},
			career: {
				bounty_hunter: {
					value_de: 'Kopfgeldjäger',
					value_en: 'Bounty Hunter'
				},
				pilot: {
					value_de: 'Pilot',
					value_en: 'Pilot'
				}
			}
		}*/
		
		$rootScope.$watch('profil', function () {
			if ($rootScope.charList == null && $rootScope.profil != null) {
				charService.init(function () {
					$rootScope.charList = charService.getCharList();
				});
			}
		});
		
		
		$scope.createChar = function () {		
			if ($scope.newCharModel) {
				var charModel = {
					char: {
						name: $scope.newCharModel.name
					},
					initiator: $rootScope.profil.$id
				};
				
				charService.createChar(charModel, function () {
					alertService.addAlert({
						type: 'success',
						text: 'Der Char mit dem Namen "' + $scope.newCharModel.name + '" wurde erfolgreich erstellt.'
					});
					$scope.newCharModel = null;
				});
			} else {
				alertService.addAlert({
						type: 'info',
						text: 'Bitte einen Namen für den Char angeben.'
					});
			}
		}
		
		
		$scope.removeChar = function () {
			//$scope.showUserlistLoading = true;
			
			charService.removeChar($scope.DeleteCharModel, function(error) {				
				//$scope.showUserlistLoading = false;
				
				if (!error) {
					alertService.addAlert({
						type: 'success',
						text: 'Der Char mit dem Namen "' + $scope.DeleteCharModel.name + '" wurde erfolgreich gelöscht.'
					});
				} else {
					alertService.addAlert({
						type: 'error',
						text: 'Es ist ein Fehler aufgetreten. Der User mit der E-Mail "' + $scope.DeleteCharModel.name + '" konnte nicht gelöscht werden.'
					});
				}
				
				$scope.closeDeleteAlert();
				$scope.DeleteCharModel = null;
			});
		}
		
		
		$scope.selectChar = function (id) {
			$rootScope.SelectedCharModel = {
				char: charService.getChar(id),
				initiator: null
			};
			
			if ($rootScope.SelectedCharModel.char == null) {
				alertService.addAlert({
						type: 'error',
						text: 'Der Char mit der ID "' + id + '" existriert nicht.'
					});
			} else {
				if (!$rootScope.SelectedCharModel.char.attributes) $rootScope.SelectedCharModel.char.attributes = {};
				if (!$rootScope.SelectedCharModel.char.skills) $rootScope.SelectedCharModel.char.skills = {};
				if (!$rootScope.SelectedCharModel.char.skills.basic) $rootScope.SelectedCharModel.char.skills.basic = {};
				if (!$rootScope.SelectedCharModel.char.skills.basic) $rootScope.SelectedCharModel.char.skills.battle = {};
				if (!$rootScope.SelectedCharModel.char.skills.basic) $rootScope.SelectedCharModel.char.skills.knowledge = {};
				if (!$rootScope.SelectedCharModel.char.skills.basic.astronavigation) $rootScope.SelectedCharModel.char.skills.basic.astronavigation = {"name": "astronavigation", "i18n": "skills.basic.astronavigation", "attribute": {"name": "intellect", "i18n": "attributes.intellectSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.athletic) $rootScope.SelectedCharModel.char.skills.basic.athletic = {"name": "athletic", "i18n": "skills.basic.athletic", "attribute": {"name": "brawn", "i18n": "attributes.brawnSmall"}};
			}
		}
		
		
		$scope.getDice = function (skill) {
			var diceString = "";
		
			if (skill) {
				var skillValue = skill.rank || 0;
				var attributeValue = $rootScope.SelectedCharModel.char.attributes[skill.attribute.name] || 0;
				var loopGe = 0;
				var loopGr = 0;
				
				if (skillValue > 0 || attributeValue > 0) {
					if (skillValue > attributeValue) {
						loopGe = attributeValue;
						loopGr = skillValue - attributeValue;
					} else {
						loopGe = skillValue;
						loopGr = attributeValue - skillValue;
					}
					
					for (i = 0; i < loopGe; i++) {
						diceString += "G";
					}
					
					for (i = 0; i < loopGr; i++) {
						diceString += "g";
					}
				}
			}
			
			return diceString;
		}
		
		
		$scope.updateChar = function (fieldValue) {
			if (fieldValue) {
				$rootScope.SelectedCharModel.initiator = $rootScope.profil.$id;
				
				charService.modifyChar($rootScope.SelectedCharModel, function(error) {
					if (error) {
						switch (error.code) {
							default:
								alertService.addAlert({
									type: 'error',
									text: 'Es ist ein Fehler aufgetreten (Error-Code: ' + error.code + ').'
								});
							break;
						}
					}
				});
			}
		}
		
		
		$scope.deselectChar = function () {
			$rootScope.SelectedCharModel = null;
		}
		
		
		$scope.deleteChar = function (id) {
			$scope.DeleteCharModel = charService.getChar(id);
			if ($scope.DeleteCharModel != null) {
				$scope.showDeleteCharWarning = true;
			}
		}
		
		
		$scope.cancelDeleting = function () {
			$scope.closeDeleteAlert();
			$scope.showDeleteCharWarning = false;
			$scope.DeleteCharModel = null;
		}
		
		
		$scope.beginEditChar = function () {
			$scope.showCharEditing = true;
		}
		
		
		$scope.endEditChar = function () {
			$scope.showCharEditing = false;
		}
		
		
		$scope.closeDeleteAlert = function () {
			$('#delete-modal').modal('hide');
		}
		
	});