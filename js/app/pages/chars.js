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
	
	.filter('loop', function () {
		return function (input, total) {
			total = parseInt(total);
			for (var i=0; i<total; i++)
				input.push(i);
			return input;
		};
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
						name: $scope.newCharModel.name,
						skills: {
							basic: {
								astrogation: {
									name: "astrogation",
									i18n: "skills.basic.astrogation",
									rank: 0,
									attribute: {
										name: "intellect",
										i18n: "attributes.intellectSmall"
									}
								},
								athletic: {
									name: "athletic",
									i18n: "skills.basic.athletic",
									rank: 0,
									attribute: {
										name: "brawn",
										i18n: "attributes.brawnSmall"
									}
								},
								charm: {
									name: "charm",
									i18n: "skills.basic.charm",
									rank: 0,
									attribute: {
										name: "presence",
										i18n: "attributes.presenceSmall"
									}
								},
								coercion: {
									name: "coercion",
									i18n: "skills.basic.coercion",
									rank: 0,
									attribute: {
										name: "willpower",
										i18n: "attributes.willpowerSmall"
									}
								},
								computers: {
									name: "computers",
									i18n: "skills.basic.computers",
									rank: 0,
									attribute: {
										name: "intellect",
										i18n: "attributes.intellectSmall"
									}
								},
								computers: {
									name: "computers",
									i18n: "skills.basic.computers",
									rank: 0,
									attribute: {
										name: "intellect",
										i18n: "attributes.intellectSmall"
									}
								},
								cool: {
									name: "cool",
									i18n: "skills.basic.cool",
									rank: 0,
									attribute: {
										name: "presence",
										i18n: "attributes.presenceSmall"
									}
								},
								coordination: {
									name: "coordination",
									i18n: "skills.basic.coordination",
									rank: 0,
									attribute: {
										name: "agility",
										i18n: "attributes.agilitySmall"
									}
								},
								deception: {
									name: "deception",
									i18n: "skills.basic.deception",
									rank: 0,
									attribute: {
										name: "cunning",
										i18n: "attributes.cunningSmall"
									}
								},
								discipline: {
									name: "discipline",
									i18n: "skills.basic.discipline",
									rank: 0,
									attribute: {
										name: "willpower",
										i18n: "attributes.willpowerSmall"
									}
								},
								mechanics: {
									name: "mechanics",
									i18n: "skills.basic.mechanics",
									rank: 0,
									attribute: {
										name: "intellect",
										i18n: "attributes.intellectSmall"
									}
								},
								medicine: {
									name: "medicine",
									i18n: "skills.basic.medicine",
									rank: 0,
									attribute: {
										name: "intellect",
										i18n: "attributes.intellectSmall"
									}
								},
								negotiation: {
									name: "negotiation",
									i18n: "skills.basic.negotiation",
									rank: 0,
									attribute: {
										name: "presence",
										i18n: "attributes.presenceSmall"
									}
								},
								perception: {
									name: "perception",
									i18n: "skills.basic.perception",
									rank: 0,
									attribute: {
										name: "cunning",
										i18n: "attributes.cunningSmall"
									}
								},
								pilotingPlanetary: {
									name: "pilotingPlanetary",
									i18n: "skills.basic.pilotingPlanetary",
									rank: 0,
									attribute: {
										name: "agility",
										i18n: "attributes.agilitySmall"
									}
								},
								pilotingSpace: {
									name: "pilotingSpace",
									i18n: "skills.basic.pilotingSpace",
									rank: 0,
									attribute: {
										name: "agility",
										i18n: "attributes.agilitySmall"
									}
								},
								resilience: {
									name: "resilience",
									i18n: "skills.basic.resilience",
									rank: 0,
									attribute: {
										name: "brawn",
										i18n: "attributes.brawnSmall"
									}
								},
								skulduggery: {
									name: "skulduggery",
									i18n: "skills.basic.skulduggery",
									rank: 0,
									attribute: {
										name: "cunning",
										i18n: "attributes.cunningSmall"
									}
								},
								stealth: {
									name: "stealth",
									i18n: "skills.basic.stealth",
									rank: 0,
									attribute: {
										name: "agility",
										i18n: "attributes.agilitySmall"
									}
								},
								streetwise: {
									name: "streetwise",
									i18n: "skills.basic.streetwise",
									rank: 0,
									attribute: {
										name: "cunning",
										i18n: "attributes.cunningSmall"
									}
								},
								survival: {
									name: "survival",
									i18n: "skills.basic.survival",
									rank: 0,
									attribute: {
										name: "cunning",
										i18n: "attributes.cunningSmall"
									}
								},
								vigilance: {
									name: "vigilance",
									i18n: "skills.basic.vigilance",
									rank: 0,
									attribute: {
										name: "willpower",
										i18n: "attributes.willpowerSmall"
									}
								}								
							},
							battle: {
								brawl: {
									name: "brawl",
									i18n: "skills.battle.brawl",
									rank: 0,
									attribute: {
										name: "brawn",
										i18n: "attributes.brawnSmall"
									}
								},
								gunnery: {
									name: "gunnery",
									i18n: "skills.battle.gunnery",
									rank: 0,
									attribute: {
										name: "agility",
										i18n: "attributes.agilitySmall"
									}
								},
								melee: {
									name: "melee",
									i18n: "skills.battle.melee",
									rank: 0,
									attribute: {
										name: "brawn",
										i18n: "attributes.brawnSmall"
									}
								},
								rangedLight: {
									name: "rangedLight",
									i18n: "skills.battle.rangedLight",
									rank: 0,
									attribute: {
										name: "agility",
										i18n: "attributes.agilitySmall"
									}
								},
								rangedHeavy: {
									name: "rangedHeavy",
									i18n: "skills.battle.rangedHeavy",
									rank: 0,
									attribute: {
										name: "agility",
										i18n: "attributes.agilitySmall"
									}
								}
							},
							knowledge: {
								coreWorlds: {
									name: "coreWorlds",
									i18n: "skills.knowledge.coreWorlds",
									rank: 0,
									attribute: {
										name: "intellect",
										i18n: "attributes.intellectSmall"
									}
								},
								education: {
									name: "education",
									i18n: "skills.knowledge.education",
									rank: 0,
									attribute: {
										name: "intellect",
										i18n: "attributes.intellectSmall"
									}
								},
								lore: {
									name: "lore",
									i18n: "skills.knowledge.lore",
									rank: 0,
									attribute: {
										name: "intellect",
										i18n: "attributes.intellectSmall"
									}
								},
								outerRim: {
									name: "outerRim",
									i18n: "skills.knowledge.outerRim",
									rank: 0,
									attribute: {
										name: "intellect",
										i18n: "attributes.intellectSmall"
									}
								},
								underworld: {
									name: "underworld",
									i18n: "skills.knowledge.underworld",
									rank: 0,
									attribute: {
										name: "intellect",
										i18n: "attributes.intellectSmall"
									}
								},
								xenology: {
									name: "xenology",
									i18n: "skills.knowledge.xenology",
									rank: 0,
									attribute: {
										name: "intellect",
										i18n: "attributes.intellectSmall"
									}
								}
							}
						}
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
				/* Legacy - Für Alte Chars die noch nicht über die jeweiligen Werte verfügen. */
				if (!$rootScope.SelectedCharModel.char.attributes) $rootScope.SelectedCharModel.char.attributes = {};
				if (!$rootScope.SelectedCharModel.char.skills) $rootScope.SelectedCharModel.char.skills = {};
				if (!$rootScope.SelectedCharModel.char.skills.basic) $rootScope.SelectedCharModel.char.skills.basic = {};
				if (!$rootScope.SelectedCharModel.char.skills.battle) $rootScope.SelectedCharModel.char.skills.battle = {};
				if (!$rootScope.SelectedCharModel.char.skills.knowledge) $rootScope.SelectedCharModel.char.skills.knowledge = {};
				if (!$rootScope.SelectedCharModel.char.skills.basic.astrogation) $rootScope.SelectedCharModel.char.skills.basic.astrogation = {name: "astrogation", i18n: "skills.basic.astrogation", rank: 0, attribute: {name: "intellect", i18n: "attributes.intellectSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.athletic) $rootScope.SelectedCharModel.char.skills.basic.athletic = {name: "athletic", i18n: "skills.basic.athletic", rank: 0, attribute: {name: "brawn", i18n: "attributes.brawnSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.charm) $rootScope.SelectedCharModel.char.skills.basic.charm = {name: "charm", i18n: "skills.basic.charm", rank: 0, attribute: {name: "presence", i18n: "attributes.presenceSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.coercion) $rootScope.SelectedCharModel.char.skills.basic.coercion = {name: "coercion", i18n: "skills.basic.coercion", rank: 0, attribute: {name: "willpower", i18n: "attributes.willpowerSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.computers) $rootScope.SelectedCharModel.char.skills.basic.computers = {name: "computers", i18n: "skills.basic.computers", rank: 0, attribute: {name: "intellect", i18n: "attributes.intellectSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.cool) $rootScope.SelectedCharModel.char.skills.basic.cool = {name: "cool", i18n: "skills.basic.cool", rank: 0, attribute: {name: "presence", i18n: "attributes.presenceSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.coordination) $rootScope.SelectedCharModel.char.skills.basic.coordination = {name: "coordination", i18n: "skills.basic.coordination", rank: 0, attribute: {name: "agility", i18n: "attributes.agilitySmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.deception) $rootScope.SelectedCharModel.char.skills.basic.deception = {name: "deception", i18n: "skills.basic.deception", rank: 0, attribute: {name: "cunning", i18n: "attributes.cunningSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.discipline) $rootScope.SelectedCharModel.char.skills.basic.discipline = {name: "discipline", i18n: "skills.basic.discipline", rank: 0, attribute: {name: "willpower", i18n: "attributes.willpowerSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.mechanics) $rootScope.SelectedCharModel.char.skills.basic.mechanics = {name: "mechanics", i18n: "skills.basic.mechanics", rank: 0, attribute: {name: "intellect", i18n: "attributes.intellectSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.medicine) $rootScope.SelectedCharModel.char.skills.basic.medicine = {name: "medicine", i18n: "skills.basic.medicine", rank: 0, attribute: {name: "intellect", i18n: "attributes.intellectSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.negotiation) $rootScope.SelectedCharModel.char.skills.basic.negotiation = {name: "negotiation", i18n: "skills.basic.negotiation", rank: 0, attribute: {name: "presence", i18n: "attributes.presenceSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.perception) $rootScope.SelectedCharModel.char.skills.basic.perception = {name: "perception", i18n: "skills.basic.perception", rank: 0, attribute: {name: "cunning", i18n: "attributes.cunningSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.pilotingPlanetary) $rootScope.SelectedCharModel.char.skills.basic.pilotingPlanetary = {name: "pilotingPlanetary", i18n: "skills.basic.pilotingPlanetary", rank: 0, attribute: {name: "agility", i18n: "attributes.agilitySmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.pilotingSpace) $rootScope.SelectedCharModel.char.skills.basic.pilotingSpace = {name: "pilotingSpace", i18n: "skills.basic.pilotingSpace", rank: 0, attribute: {name: "agility", i18n: "attributes.agilitySmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.resilience) $rootScope.SelectedCharModel.char.skills.basic.resilience = {name: "resilience", i18n: "skills.basic.resilience", rank: 0, attribute: {name: "brawn", i18n: "attributes.brawnSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.skulduggery) $rootScope.SelectedCharModel.char.skills.basic.skulduggery = {name: "skulduggery", i18n: "skills.basic.skulduggery", rank: 0, attribute: {name: "cunning", i18n: "attributes.cunningSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.stealth) $rootScope.SelectedCharModel.char.skills.basic.stealth = {name: "stealth", i18n: "skills.basic.stealth", rank: 0, attribute: {name: "agility", i18n: "attributes.agilitySmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.streetwise) $rootScope.SelectedCharModel.char.skills.basic.streetwise = {name: "streetwise", i18n: "skills.basic.streetwise", rank: 0, attribute: {name: "cunning", i18n: "attributes.cunningSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.survival) $rootScope.SelectedCharModel.char.skills.basic.survival = {name: "survival", i18n: "skills.basic.survival", rank: 0, attribute: {name: "cunning", i18n: "attributes.cunningSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.vigilance) $rootScope.SelectedCharModel.char.skills.basic.vigilance = {name: "vigilance", i18n: "skills.basic.vigilance", rank: 0, attribute: {name: "willpower", i18n: "attributes.willpowerSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.battle.brawl) $rootScope.SelectedCharModel.char.skills.battle.brawl = {name: "brawl", i18n: "skills.battle.brawl", rank: 0, attribute: {name: "brawn", i18n: "attributes.brawnSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.battle.gunnery) $rootScope.SelectedCharModel.char.skills.battle.gunnery = {name: "gunnery", i18n: "skills.battle.gunnery", rank: 0, attribute: {name: "agility", i18n: "attributes.agilitySmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.battle.melee) $rootScope.SelectedCharModel.char.skills.battle.melee = {name: "melee", i18n: "skills.battle.melee", rank: 0, attribute: {name: "brawn", i18n: "attributes.brawnSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.battle.rangedLight) $rootScope.SelectedCharModel.char.skills.battle.rangedLight = {name: "rangedLight", i18n: "skills.battle.rangedLight", rank: 0, attribute: {name: "agility", i18n: "attributes.agilitySmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.battle.rangedHeavy) $rootScope.SelectedCharModel.char.skills.battle.rangedHeavy = {name: "rangedHeavy", i18n: "skills.battle.rangedHeavy", rank: 0, attribute: {name: "agility", i18n: "attributes.agilitySmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.coreWorlds) $rootScope.SelectedCharModel.char.skills.knowledge.coreWorlds = {name: "coreWorlds", i18n: "skills.knowledge.coreWorlds", rank: 0, attribute: {name: "intellect", i18n: "attributes.intellectSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.education) $rootScope.SelectedCharModel.char.skills.knowledge.education = {name: "education", i18n: "skills.knowledge.education", rank: 0, attribute: {name: "intellect", i18n: "attributes.intellectSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.lore) $rootScope.SelectedCharModel.char.skills.knowledge.lore = {name: "lore", i18n: "skills.knowledge.lore", rank: 0, attribute: {name: "intellect", i18n: "attributes.intellectSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.outerRim) $rootScope.SelectedCharModel.char.skills.knowledge.outerRim = {name: "outerRim", i18n: "skills.knowledge.outerRim", rank: 0, attribute: {name: "intellect", i18n: "attributes.intellectSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.underworld) $rootScope.SelectedCharModel.char.skills.knowledge.underworld = {name: "underworld", i18n: "skills.knowledge.underworld", rank: 0, attribute: {name: "intellect", i18n: "attributes.intellectSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.xenology) $rootScope.SelectedCharModel.char.skills.knowledge.xenology = {name: "xenology", i18n: "skills.knowledge.xenology", rank: 0, attribute: {name: "intellect", i18n: "attributes.intellectSmall"}};
			}
		}
		
		
		$scope.validateSkillRank = function (skillRank) {
			if (!skillRank) return '';
		}
		
		
		$scope.validateSkillCareer = function (skillCareer) {
			if (!skillCareer) return '';
		}
		
		
		$scope.validateSkillDice = function (skillDice) {
			if (!skillDice) return '';
		}
		
		
		$scope.getProficiencyCount = function (skill) {
			var diceCount = 0;
			
			if (skill) {
				var skillValue = skill.rank || 0;
				var attributeValue = $rootScope.SelectedCharModel.char.attributes[skill.attribute.name] || 0;
				
				if (skillValue > 0 || attributeValue > 0) {
					if (skillValue > attributeValue) {
						diceCount = attributeValue;
					} else {
						diceCount = skillValue;
					}
				}
			}
			
			return diceCount;
		}
		
		
		$scope.getAbilityCount = function (skill) {
			var diceCount = 0;
			
			if (skill) {
				var skillValue = skill.rank || 0;
				var attributeValue = $rootScope.SelectedCharModel.char.attributes[skill.attribute.name] || 0;
				
				if (skillValue > 0 || attributeValue > 0) {
					if (skillValue > attributeValue) {
						diceCount = skillValue - attributeValue;
					} else {
						diceCount = attributeValue - skillValue;
					}
				}
			}
			
			return diceCount;
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