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
	
	.directive('popover', function() {
		return function(scope, elem, attrs) {
			elem;
		}
	})
	
	.controller('CharController',  function ($scope, $rootScope, $state, $translatePartialLoader, $translate, charService, alertService) {
		
		/* Hält den AlertService. */
		$scope.alertService = alertService;
		/* Neuer Char */
		$scope.newCharModel = null;
		/* DeleteCharModel für die Delete-Maske */
		$scope.DeleteCharModel = null;
		/* DeleteSkillModel für die Delete-Maske */
		$scope.DeleteSkillModel = null;
		/* Triggert das DeleteCharWarning .*/
		$scope.showDeleteCharWarning = false;
		/* Triggert das DeleteSkillWarning .*/
		$scope.showDeleteSkillWarning = false;
		/* Triggert das Bearbeiten eines Chars .*/
		$scope.showCharEditing = false;
		/* Lädt die Lokalisation */
		$translatePartialLoader.addPart('chars');
		/* Zeige Buttons bei xeditable */
		$scope.buttons = (!/iPad|iPhone|iPod/g.test(navigator.userAgent)) ? 'no' : 'right';	
	
		$scope.choosableAttributes = {
			brawn: {value: "brawn", text: "", i18n: "attributes.brawn", i18nSmall: "attributes.brawnSmall"},
			agility: {value: "agility", text: "", i18n: "attributes.agility", i18nSmall: "attributes.agilitySmall"},
			intellect: {value: "intellect", text: "", i18n: "attributes.intellect", i18nSmall: "attributes.intellectSmall"},
			cunning: {value: "cunning",  text: "", i18n: "attributes.cunning", i18nSmall: "attributes.cunningSmall"},
			willpower: {value: "willpower", text: "", i18n: "attributes.willpower", i18nSmall: "attributes.willpowerSmall"},
			presence: {value: "presence", text: "", i18n: "attributes.presence", i18nSmall: "attributes.presenceSmall"}
		};
		
		
		/*$scope.translateAttribute = function (attributeI18N) {
			$translate(attributeI18N).then(function (attribute) {
				$scope.namespaced_paragraph = attribute;
			});
		}*/
		
		
		$rootScope.$on('$translateChangeSuccess', function () {
			// Für "choosableAttributes"
			jQuery.each($scope.choosableAttributes, function(key, attribute) {
				$translate(attribute.i18n).then(function (translation) {
					attribute.text = translation;
				});
			});
		});

		
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
						species: "",
						career: "",
						specialisation: "",
						soak: 0,
						wound: {
							limit: 0,
							current: 0
						},
						strain: {
							limit: 0,
							current: 0
						},
						defense: {
							ranged: 0,
							melee: 0
						},
						attributes: {
							brawn: 0,
							agility: 0,
							intellect: 0,
							cunning: 0,
							willpower: 0,
							presence: 0
						},
						skills: {
							basic: {
								astrogation: {
									name: "astrogation",
									i18n: "skills.basic.astrogation",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "intellect",
										i18n: "attributes.intellectSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								athletic: {
									name: "athletic",
									i18n: "skills.basic.athletic",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "brawn",
										i18n: "attributes.brawnSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								charm: {
									name: "charm",
									i18n: "skills.basic.charm",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "presence",
										i18n: "attributes.presenceSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								coercion: {
									name: "coercion",
									i18n: "skills.basic.coercion",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "willpower",
										i18n: "attributes.willpowerSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								computers: {
									name: "computers",
									i18n: "skills.basic.computers",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "intellect",
										i18n: "attributes.intellectSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								computers: {
									name: "computers",
									i18n: "skills.basic.computers",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "intellect",
										i18n: "attributes.intellectSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								cool: {
									name: "cool",
									i18n: "skills.basic.cool",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "presence",
										i18n: "attributes.presenceSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								coordination: {
									name: "coordination",
									i18n: "skills.basic.coordination",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "agility",
										i18n: "attributes.agilitySmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								deception: {
									name: "deception",
									i18n: "skills.basic.deception",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "cunning",
										i18n: "attributes.cunningSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								discipline: {
									name: "discipline",
									i18n: "skills.basic.discipline",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "willpower",
										i18n: "attributes.willpowerSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								leadership: {
									name: "leadership",
									i18n: "skills.basic.leadership",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "presence",
										i18n: "attributes.presenceSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								mechanics: {
									name: "mechanics",
									i18n: "skills.basic.mechanics",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "intellect",
										i18n: "attributes.intellectSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								medicine: {
									name: "medicine",
									i18n: "skills.basic.medicine",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "intellect",
										i18n: "attributes.intellectSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								negotiation: {
									name: "negotiation",
									i18n: "skills.basic.negotiation",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "presence",
										i18n: "attributes.presenceSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								perception: {
									name: "perception",
									i18n: "skills.basic.perception",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "cunning",
										i18n: "attributes.cunningSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								pilotingPlanetary: {
									name: "pilotingPlanetary",
									i18n: "skills.basic.pilotingPlanetary",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "agility",
										i18n: "attributes.agilitySmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								pilotingSpace: {
									name: "pilotingSpace",
									i18n: "skills.basic.pilotingSpace",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "agility",
										i18n: "attributes.agilitySmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								resilience: {
									name: "resilience",
									i18n: "skills.basic.resilience",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "brawn",
										i18n: "attributes.brawnSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								skulduggery: {
									name: "skulduggery",
									i18n: "skills.basic.skulduggery",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "cunning",
										i18n: "attributes.cunningSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								stealth: {
									name: "stealth",
									i18n: "skills.basic.stealth",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "agility",
										i18n: "attributes.agilitySmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								streetwise: {
									name: "streetwise",
									i18n: "skills.basic.streetwise",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "cunning",
										i18n: "attributes.cunningSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								survival: {
									name: "survival",
									i18n: "skills.basic.survival",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "cunning",
										i18n: "attributes.cunningSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								vigilance: {
									name: "vigilance",
									i18n: "skills.basic.vigilance",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "willpower",
										i18n: "attributes.willpowerSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								}								
							},
							battle: {
								brawl: {
									name: "brawl",
									i18n: "skills.battle.brawl",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "brawn",
										i18n: "attributes.brawnSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								gunnery: {
									name: "gunnery",
									i18n: "skills.battle.gunnery",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "agility",
										i18n: "attributes.agilitySmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								melee: {
									name: "melee",
									i18n: "skills.battle.melee",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "brawn",
										i18n: "attributes.brawnSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								rangedLight: {
									name: "rangedLight",
									i18n: "skills.battle.rangedLight",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "agility",
										i18n: "attributes.agilitySmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								rangedHeavy: {
									name: "rangedHeavy",
									i18n: "skills.battle.rangedHeavy",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "agility",
										i18n: "attributes.agilitySmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								}
							},
							knowledge: {
								coreWorlds: {
									name: "coreWorlds",
									i18n: "skills.knowledge.coreWorlds",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "intellect",
										i18n: "attributes.intellectSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								education: {
									name: "education",
									i18n: "skills.knowledge.education",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "intellect",
										i18n: "attributes.intellectSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								lore: {
									name: "lore",
									i18n: "skills.knowledge.lore",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "intellect",
										i18n: "attributes.intellectSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								outerRim: {
									name: "outerRim",
									i18n: "skills.knowledge.outerRim",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "intellect",
										i18n: "attributes.intellectSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								underworld: {
									name: "underworld",
									i18n: "skills.knowledge.underworld",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "intellect",
										i18n: "attributes.intellectSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								warefare: {
									name: "warefare",
									i18n: "skills.knowledge.warefare",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "intellect",
										i18n: "attributes.intellectSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
									}
								},
								xenology: {
									name: "xenology",
									i18n: "skills.knowledge.xenology",
									rank: 0,
									career: "",
									note: "",
									attribute: {
										name: "intellect",
										i18n: "attributes.intellectSmall"
									},
									modifications: {
										proficiency: 0,
										ability: 0,
										boost: 0,
										force: 0,
										challenge: 0,
										difficulty: 0,
										setback: 0,
										triumph: 0,
										success: 0,
										advantage: 0,
										lightside: 0,
										despair: 0,
										failure: 0,
										threat: 0,
										darkside: 0
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
						text: 'Es ist ein Fehler aufgetreten. Der Char mit dem Namen "' + $scope.DeleteCharModel.name + '" konnte nicht gelöscht werden.'
					});
				}
				
				$scope.closeDeleteCharAlert();
				$scope.DeleteCharModel = null;
			});
		}
		
		
		$scope.removeSkill = function () {
			if ($scope.DeleteSkillModel != null) {
				delete $rootScope.SelectedCharModel.char.skills.custom["skill" + $scope.DeleteSkillModel.index];
				
				$scope.updateChar(function (error) {
					if (error) {
						alertService.addAlert({
							type: 'error',
							text: 'Es ist ein Fehler aufgetreten. Der Skill "' + $scope.DeleteSkillModel.name + '" konnte nicht gelöscht werden.'
						});
					}
					
					$scope.DeleteSkillModel = null;
				});
					
				$scope.closeDeleteSkillAlert();
			}
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
				/* Legacy - Für alte Chars die noch nicht über die jeweiligen Werte verfügen. */
				if (!$rootScope.SelectedCharModel.char.soak) $rootScope.SelectedCharModel.char.soak = 0;
				if (!$rootScope.SelectedCharModel.char.defense) $rootScope.SelectedCharModel.char.defense = {};
				if (!$rootScope.SelectedCharModel.char.defense.ranged) $rootScope.SelectedCharModel.char.defense.ranged = 0;
				if (!$rootScope.SelectedCharModel.char.defense.melee) $rootScope.SelectedCharModel.char.defense.melee = 0;
				if (!$rootScope.SelectedCharModel.char.strain) $rootScope.SelectedCharModel.char.strain = {};
				if (!$rootScope.SelectedCharModel.char.strain.current) $rootScope.SelectedCharModel.char.strain.current = 0;
				if (!$rootScope.SelectedCharModel.char.strain.limit) $rootScope.SelectedCharModel.char.strain.limit = 0;
				if (!$rootScope.SelectedCharModel.char.wound) $rootScope.SelectedCharModel.char.wound = {};
				if (!$rootScope.SelectedCharModel.char.wound.current) $rootScope.SelectedCharModel.char.wound.current = 0;
				if (!$rootScope.SelectedCharModel.char.wound.limit) $rootScope.SelectedCharModel.char.wound.limit = 0;
				if (!$rootScope.SelectedCharModel.char.attributes) $rootScope.SelectedCharModel.char.attributes = {};
				if (!$rootScope.SelectedCharModel.char.attributes.brawn) $rootScope.SelectedCharModel.char.attributes.brawn = 0;
				if (!$rootScope.SelectedCharModel.char.attributes.agility) $rootScope.SelectedCharModel.char.attributes.agility = 0;
				if (!$rootScope.SelectedCharModel.char.attributes.intellect) $rootScope.SelectedCharModel.char.attributes.intellect = 0;
				if (!$rootScope.SelectedCharModel.char.attributes.cunning) $rootScope.SelectedCharModel.char.attributes.cunning = 0;
				if (!$rootScope.SelectedCharModel.char.attributes.willpower) $rootScope.SelectedCharModel.char.attributes.willpower = 0;
				if (!$rootScope.SelectedCharModel.char.attributes.presence) $rootScope.SelectedCharModel.char.attributes.presence = 0;
				if (!$rootScope.SelectedCharModel.char.skills) $rootScope.SelectedCharModel.char.skills = {};
				if (!$rootScope.SelectedCharModel.char.skills.basic) $rootScope.SelectedCharModel.char.skills.basic = {};
				if (!$rootScope.SelectedCharModel.char.skills.battle) $rootScope.SelectedCharModel.char.skills.battle = {};
				if (!$rootScope.SelectedCharModel.char.skills.knowledge) $rootScope.SelectedCharModel.char.skills.knowledge = {};
				if (!$rootScope.SelectedCharModel.char.skills.basic.astrogation) $rootScope.SelectedCharModel.char.skills.basic.astrogation = {name: "astrogation", i18n: "skills.basic.astrogation", rank: 0, career: "", note: "", attribute: {name: "intellect", i18n: "attributes.intellectSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.astrogation.rank) $rootScope.SelectedCharModel.char.skills.basic.astrogation.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.basic.astrogation.note) $rootScope.SelectedCharModel.char.skills.basic.astrogation.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.basic.astrogation.modifications) $rootScope.SelectedCharModel.char.skills.basic.astrogation.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.basic.athletic) $rootScope.SelectedCharModel.char.skills.basic.athletic = {name: "athletic", i18n: "skills.basic.athletic", rank: 0, career: "", note: "", attribute: {name: "brawn", i18n: "attributes.brawnSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.athletic.rank) $rootScope.SelectedCharModel.char.skills.basic.athletic.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.basic.athletic.note) $rootScope.SelectedCharModel.char.skills.basic.athletic.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.basic.athletic.modifications) $rootScope.SelectedCharModel.char.skills.basic.athletic.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.basic.charm) $rootScope.SelectedCharModel.char.skills.basic.charm = {name: "charm", i18n: "skills.basic.charm", rank: 0, career: "", note: "", attribute: {name: "presence", i18n: "attributes.presenceSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.charm.rank) $rootScope.SelectedCharModel.char.skills.basic.charm.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.basic.charm.note) $rootScope.SelectedCharModel.char.skills.basic.charm.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.basic.charm.modifications) $rootScope.SelectedCharModel.char.skills.basic.charm.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.basic.coercion) $rootScope.SelectedCharModel.char.skills.basic.coercion = {name: "coercion", i18n: "skills.basic.coercion", rank: 0, career: "", note: "", attribute: {name: "willpower", i18n: "attributes.willpowerSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.coercion.rank) $rootScope.SelectedCharModel.char.skills.basic.coercion.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.basic.coercion.note) $rootScope.SelectedCharModel.char.skills.basic.coercion.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.basic.coercion.modifications) $rootScope.SelectedCharModel.char.skills.basic.coercion.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.basic.computers) $rootScope.SelectedCharModel.char.skills.basic.computers = {name: "computers", i18n: "skills.basic.computers", rank: 0, career: "", note: "", attribute: {name: "intellect", i18n: "attributes.intellectSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.computers.rank) $rootScope.SelectedCharModel.char.skills.basic.computers.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.basic.computers.note) $rootScope.SelectedCharModel.char.skills.basic.computers.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.basic.computers.modifications) $rootScope.SelectedCharModel.char.skills.basic.computers.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.basic.cool) $rootScope.SelectedCharModel.char.skills.basic.cool = {name: "cool", i18n: "skills.basic.cool", rank: 0, career: "", note: "", attribute: {name: "presence", i18n: "attributes.presenceSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.cool.rank) $rootScope.SelectedCharModel.char.skills.basic.cool.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.basic.cool.note) $rootScope.SelectedCharModel.char.skills.basic.cool.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.basic.cool.modifications) $rootScope.SelectedCharModel.char.skills.basic.cool.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.basic.coordination) $rootScope.SelectedCharModel.char.skills.basic.coordination = {name: "coordination", i18n: "skills.basic.coordination", rank: 0, career: "", note: "", attribute: {name: "agility", i18n: "attributes.agilitySmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.coordination.rank) $rootScope.SelectedCharModel.char.skills.basic.coordination.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.basic.coordination.note) $rootScope.SelectedCharModel.char.skills.basic.coordination.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.basic.coordination.modifications) $rootScope.SelectedCharModel.char.skills.basic.coordination.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.basic.deception) $rootScope.SelectedCharModel.char.skills.basic.deception = {name: "deception", i18n: "skills.basic.deception", rank: 0, career: "", note: "", attribute: {name: "cunning", i18n: "attributes.cunningSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.deception.rank) $rootScope.SelectedCharModel.char.skills.basic.deception.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.basic.deception.note) $rootScope.SelectedCharModel.char.skills.basic.deception.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.basic.deception.modifications) $rootScope.SelectedCharModel.char.skills.basic.deception.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.basic.discipline) $rootScope.SelectedCharModel.char.skills.basic.discipline = {name: "discipline", i18n: "skills.basic.discipline", rank: 0, career: "", note: "", attribute: {name: "willpower", i18n: "attributes.willpowerSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.discipline.rank) $rootScope.SelectedCharModel.char.skills.basic.discipline.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.basic.discipline.note) $rootScope.SelectedCharModel.char.skills.basic.discipline.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.basic.discipline.modifications) $rootScope.SelectedCharModel.char.skills.basic.discipline.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.basic.leadership) $rootScope.SelectedCharModel.char.skills.basic.leadership = {name: "leadership", i18n: "skills.basic.leadership", rank: 0, career: "", note: "", attribute: {name: "presence", i18n: "attributes.presenceSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.leadership.rank) $rootScope.SelectedCharModel.char.skills.basic.leadership.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.basic.leadership.note) $rootScope.SelectedCharModel.char.skills.basic.leadership.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.basic.leadership.modifications) $rootScope.SelectedCharModel.char.skills.basic.leadership.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.basic.mechanics) $rootScope.SelectedCharModel.char.skills.basic.mechanics = {name: "mechanics", i18n: "skills.basic.mechanics", rank: 0, career: "", note: "", attribute: {name: "intellect", i18n: "attributes.intellectSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.mechanics.rank) $rootScope.SelectedCharModel.char.skills.basic.mechanics.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.basic.mechanics.note) $rootScope.SelectedCharModel.char.skills.basic.mechanics.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.basic.mechanics.modifications) $rootScope.SelectedCharModel.char.skills.basic.mechanics.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.basic.medicine) $rootScope.SelectedCharModel.char.skills.basic.medicine = {name: "medicine", i18n: "skills.basic.medicine", rank: 0, career: "", note: "", attribute: {name: "intellect", i18n: "attributes.intellectSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.medicine.rank) $rootScope.SelectedCharModel.char.skills.basic.medicine.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.basic.medicine.note) $rootScope.SelectedCharModel.char.skills.basic.medicine.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.basic.medicine.modifications) $rootScope.SelectedCharModel.char.skills.basic.medicine.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.basic.negotiation) $rootScope.SelectedCharModel.char.skills.basic.negotiation = {name: "negotiation", i18n: "skills.basic.negotiation", rank: 0, career: "", note: "", attribute: {name: "presence", i18n: "attributes.presenceSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.negotiation.rank) $rootScope.SelectedCharModel.char.skills.basic.negotiation.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.basic.negotiation.note) $rootScope.SelectedCharModel.char.skills.basic.negotiation.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.basic.negotiation.modifications) $rootScope.SelectedCharModel.char.skills.basic.negotiation.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.basic.perception) $rootScope.SelectedCharModel.char.skills.basic.perception = {name: "perception", i18n: "skills.basic.perception", rank: 0, career: "", note: "", attribute: {name: "cunning", i18n: "attributes.cunningSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.perception.rank) $rootScope.SelectedCharModel.char.skills.basic.perception.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.basic.perception.note) $rootScope.SelectedCharModel.char.skills.basic.perception.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.basic.perception.modifications) $rootScope.SelectedCharModel.char.skills.basic.perception.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.basic.pilotingPlanetary) $rootScope.SelectedCharModel.char.skills.basic.pilotingPlanetary = {name: "pilotingPlanetary", i18n: "skills.basic.pilotingPlanetary", rank: 0, career: "", note: "", attribute: {name: "agility", i18n: "attributes.agilitySmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.pilotingPlanetary.rank) $rootScope.SelectedCharModel.char.skills.basic.pilotingPlanetary.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.basic.pilotingPlanetary.note) $rootScope.SelectedCharModel.char.skills.basic.pilotingPlanetary.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.basic.pilotingPlanetary.modifications) $rootScope.SelectedCharModel.char.skills.basic.pilotingPlanetary.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.basic.pilotingSpace) $rootScope.SelectedCharModel.char.skills.basic.pilotingSpace = {name: "pilotingSpace", i18n: "skills.basic.pilotingSpace", rank: 0, career: "", note: "", attribute: {name: "agility", i18n: "attributes.agilitySmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.pilotingSpace.rank) $rootScope.SelectedCharModel.char.skills.basic.pilotingSpace.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.basic.pilotingSpace.note) $rootScope.SelectedCharModel.char.skills.basic.pilotingSpace.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.basic.pilotingSpace.modifications) $rootScope.SelectedCharModel.char.skills.basic.pilotingSpace.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.basic.resilience) $rootScope.SelectedCharModel.char.skills.basic.resilience = {name: "resilience", i18n: "skills.basic.resilience", rank: 0, career: "", note: "", attribute: {name: "brawn", i18n: "attributes.brawnSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.resilience.rank) $rootScope.SelectedCharModel.char.skills.basic.resilience.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.basic.resilience.note) $rootScope.SelectedCharModel.char.skills.basic.resilience.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.basic.resilience.modifications) $rootScope.SelectedCharModel.char.skills.basic.resilience.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.basic.skulduggery) $rootScope.SelectedCharModel.char.skills.basic.skulduggery = {name: "skulduggery", i18n: "skills.basic.skulduggery", rank: 0, career: "", note: "", attribute: {name: "cunning", i18n: "attributes.cunningSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.skulduggery.rank) $rootScope.SelectedCharModel.char.skills.basic.skulduggery.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.basic.skulduggery.note) $rootScope.SelectedCharModel.char.skills.basic.skulduggery.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.basic.skulduggery.modifications) $rootScope.SelectedCharModel.char.skills.basic.skulduggery.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.basic.stealth) $rootScope.SelectedCharModel.char.skills.basic.stealth = {name: "stealth", i18n: "skills.basic.stealth", rank: 0, career: "", note: "", attribute: {name: "agility", i18n: "attributes.agilitySmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.stealth.rank) $rootScope.SelectedCharModel.char.skills.basic.stealth.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.basic.stealth.note) $rootScope.SelectedCharModel.char.skills.basic.stealth.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.basic.stealth.modifications) $rootScope.SelectedCharModel.char.skills.basic.stealth.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.basic.streetwise) $rootScope.SelectedCharModel.char.skills.basic.streetwise = {name: "streetwise", i18n: "skills.basic.streetwise", rank: 0, career: "", note: "", attribute: {name: "cunning", i18n: "attributes.cunningSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.streetwise.rank) $rootScope.SelectedCharModel.char.skills.basic.streetwise.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.basic.streetwise.note) $rootScope.SelectedCharModel.char.skills.basic.streetwise.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.basic.streetwise.modifications) $rootScope.SelectedCharModel.char.skills.basic.streetwise.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.basic.survival) $rootScope.SelectedCharModel.char.skills.basic.survival = {name: "survival", i18n: "skills.basic.survival", rank: 0, career: "", note: "", attribute: {name: "cunning", i18n: "attributes.cunningSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.survival.rank) $rootScope.SelectedCharModel.char.skills.basic.survival.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.basic.survival.note) $rootScope.SelectedCharModel.char.skills.basic.survival.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.basic.survival.modifications) $rootScope.SelectedCharModel.char.skills.basic.survival.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.basic.vigilance) $rootScope.SelectedCharModel.char.skills.basic.vigilance = {name: "vigilance", i18n: "skills.basic.vigilance", rank: 0, career: "", note: "", attribute: {name: "willpower", i18n: "attributes.willpowerSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.basic.vigilance.rank) $rootScope.SelectedCharModel.char.skills.basic.vigilance.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.basic.vigilance.note) $rootScope.SelectedCharModel.char.skills.basic.vigilance.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.basic.vigilance.modifications) $rootScope.SelectedCharModel.char.skills.basic.vigilance.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.battle.brawl) $rootScope.SelectedCharModel.char.skills.battle.brawl = {name: "brawl", i18n: "skills.battle.brawl", rank: 0, career: "", note: "", attribute: {name: "brawn", i18n: "attributes.brawnSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.battle.brawl.rank) $rootScope.SelectedCharModel.char.skills.battle.brawl.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.battle.brawl.note) $rootScope.SelectedCharModel.char.skills.battle.brawl.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.battle.brawl.modifications) $rootScope.SelectedCharModel.char.skills.battle.brawl.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.battle.gunnery) $rootScope.SelectedCharModel.char.skills.battle.gunnery = {name: "gunnery", i18n: "skills.battle.gunnery", rank: 0, career: "", note: "", attribute: {name: "agility", i18n: "attributes.agilitySmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.battle.gunnery.rank) $rootScope.SelectedCharModel.char.skills.battle.gunnery.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.battle.gunnery.note) $rootScope.SelectedCharModel.char.skills.battle.gunnery.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.battle.gunnery.modifications) $rootScope.SelectedCharModel.char.skills.battle.gunnery.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.battle.melee) $rootScope.SelectedCharModel.char.skills.battle.melee = {name: "melee", i18n: "skills.battle.melee", rank: 0, career: "", note: "", attribute: {name: "brawn", i18n: "attributes.brawnSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.battle.melee.rank) $rootScope.SelectedCharModel.char.skills.battle.melee.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.battle.melee.note) $rootScope.SelectedCharModel.char.skills.battle.melee.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.battle.melee.modifications) $rootScope.SelectedCharModel.char.skills.battle.melee.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.battle.rangedLight) $rootScope.SelectedCharModel.char.skills.battle.rangedLight = {name: "rangedLight", i18n: "skills.battle.rangedLight", rank: 0, career: "", note: "", attribute: {name: "agility", i18n: "attributes.agilitySmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.battle.rangedLight.rank) $rootScope.SelectedCharModel.char.skills.battle.rangedLight.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.battle.rangedLight.note) $rootScope.SelectedCharModel.char.skills.battle.rangedLight.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.battle.rangedLight.modifications) $rootScope.SelectedCharModel.char.skills.battle.rangedLight.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.battle.rangedHeavy) $rootScope.SelectedCharModel.char.skills.battle.rangedHeavy = {name: "rangedHeavy", i18n: "skills.battle.rangedHeavy", rank: 0, career: "", note: "", attribute: {name: "agility", i18n: "attributes.agilitySmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.battle.rangedHeavy.rank) $rootScope.SelectedCharModel.char.skills.battle.rangedHeavy.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.battle.rangedHeavy.note) $rootScope.SelectedCharModel.char.skills.battle.rangedHeavy.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.battle.rangedHeavy.modifications) $rootScope.SelectedCharModel.char.skills.battle.rangedHeavy.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.coreWorlds) $rootScope.SelectedCharModel.char.skills.knowledge.coreWorlds = {name: "coreWorlds", i18n: "skills.knowledge.coreWorlds", rank: 0, career: "", note: "", attribute: {name: "intellect", i18n: "attributes.intellectSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.coreWorlds.rank) $rootScope.SelectedCharModel.char.skills.knowledge.coreWorlds.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.coreWorlds.note) $rootScope.SelectedCharModel.char.skills.knowledge.coreWorlds.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.coreWorlds.modifications) $rootScope.SelectedCharModel.char.skills.knowledge.coreWorlds.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.education) $rootScope.SelectedCharModel.char.skills.knowledge.education = {name: "education", i18n: "skills.knowledge.education", rank: 0, career: "", note: "", attribute: {name: "intellect", i18n: "attributes.intellectSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.education.rank) $rootScope.SelectedCharModel.char.skills.knowledge.education.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.education.note) $rootScope.SelectedCharModel.char.skills.knowledge.education.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.education.modifications) $rootScope.SelectedCharModel.char.skills.knowledge.education.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.lore) $rootScope.SelectedCharModel.char.skills.knowledge.lore = {name: "lore", i18n: "skills.knowledge.lore", rank: 0, career: "", note: "", attribute: {name: "intellect", i18n: "attributes.intellectSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.lore.rank) $rootScope.SelectedCharModel.char.skills.knowledge.lore.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.lore.note) $rootScope.SelectedCharModel.char.skills.knowledge.lore.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.lore.modifications) $rootScope.SelectedCharModel.char.skills.knowledge.lore.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.outerRim) $rootScope.SelectedCharModel.char.skills.knowledge.outerRim = {name: "outerRim", i18n: "skills.knowledge.outerRim", rank: 0, career: "", note: "", attribute: {name: "intellect", i18n: "attributes.intellectSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.outerRim.rank) $rootScope.SelectedCharModel.char.skills.knowledge.outerRim.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.outerRim.note) $rootScope.SelectedCharModel.char.skills.knowledge.outerRim.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.outerRim.modifications) $rootScope.SelectedCharModel.char.skills.knowledge.outerRim.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.underworld) $rootScope.SelectedCharModel.char.skills.knowledge.underworld = {name: "underworld", i18n: "skills.knowledge.underworld", rank: 0, career: "", note: "", attribute: {name: "intellect", i18n: "attributes.intellectSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.underworld.rank) $rootScope.SelectedCharModel.char.skills.knowledge.underworld.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.underworld.note) $rootScope.SelectedCharModel.char.skills.knowledge.underworld.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.underworld.modifications) $rootScope.SelectedCharModel.char.skills.knowledge.underworld.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.xenology) $rootScope.SelectedCharModel.char.skills.knowledge.xenology = {name: "xenology", i18n: "skills.knowledge.xenology", rank: 0, career: "", note: "", attribute: {name: "intellect", i18n: "attributes.intellectSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.xenology.rank) $rootScope.SelectedCharModel.char.skills.knowledge.xenology.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.xenology.note) $rootScope.SelectedCharModel.char.skills.knowledge.xenology.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.xenology.modifications) $rootScope.SelectedCharModel.char.skills.knowledge.xenology.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.warefare) $rootScope.SelectedCharModel.char.skills.knowledge.warefare = {name: "warefare", i18n: "skills.knowledge.warefare", rank: 0, career: "", note: "", attribute: {name: "intellect", i18n: "attributes.intellectSmall"}};
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.warefare.rank) $rootScope.SelectedCharModel.char.skills.knowledge.warefare.rank = 0;
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.warefare.note) $rootScope.SelectedCharModel.char.skills.knowledge.warefare.note = "";
				if (!$rootScope.SelectedCharModel.char.skills.knowledge.warefare.modifications) $rootScope.SelectedCharModel.char.skills.knowledge.warefare.modifications = {proficiency: 0, ability: 0, boost: 0, force: 0, challenge: 0, difficulty: 0, setback: 0, triumph: 0, success: 0, advantage: 0, lightside: 0, despair: 0, failure: 0, threat: 0, darkside: 0}
			}
		}
		
		
		$scope.checkNumberNotNull = function (self) {
			if (!self.$data) self.$data = 0;
		}
		
		
		$scope.checkStringNotNull = function (self) {
			if (!self.$data) self.$data = "";
		}
		
		// TODO: Weiter machen!!!
		$scope.customSkill18n = function (skill, self) {
			if (skill && self.$data) {
				skill.attribute.i18n = $scope.choosableAttributes[self.$data].i18n;
				skill.attribute.i18nSmall = $scope.choosableAttributes[self.$data].i18nSmall;
			}
		}
		
		
		$scope.getProficiencyCountForSkill = function (skill) {
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
			
			diceCount += skill.modifications.proficiency;
			
			return diceCount;
		}
		
		
		$scope.getAbilityCountForSkill = function (skill) {
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
			
			diceCount += skill.modifications.ability;
			
			return diceCount;
		}
		
		
		$scope.updateChar = function (callback) {
			$rootScope.SelectedCharModel.initiator = $rootScope.profil.$id;
			
			if (callback == null) {
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
			} else {
				charService.modifyChar($rootScope.SelectedCharModel, callback);
			}
		}
		
		
		$scope.newSkill = function () {
			if ($rootScope.SelectedCharModel != null) {
				if ($rootScope.SelectedCharModel.char.skills.custom == null) {
					$rootScope.SelectedCharModel.char.skills.custom = {};
				}
				
				var customSkillCount = Object.keys($rootScope.SelectedCharModel.char.skills.custom).length;
				
				$rootScope.SelectedCharModel.char.skills.custom['skill' + (customSkillCount + 1)] = {
					name: "",
					rank: 0,
					career: "",
					note: "",
					attribute: {
						name: "",
						i18n: ""
					},
					modifications: {
						proficiency: 0,
						ability: 0,
						boost: 0,
						force: 0,
						challenge: 0,
						difficulty: 0,
						setback: 0,
						triumph: 0,
						success: 0,
						advantage: 0,
						lightside: 0,
						despair: 0,
						failure: 0,
						threat: 0,
						darkside: 0
					}
				}
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
		
		
		$scope.deleteSkill = function (index) {
			$scope.DeleteSkillModel = {
				index: index + 1,
				name: angular.copy($rootScope.SelectedCharModel.char.skills.custom["skill" + (index + 1)].name)
			}
			
			if ($scope.DeleteSkillModel != null) {
				$scope.showDeleteCharWarning = true;
			}
		}
		
		
		$scope.cancelDeletingChar = function () {
			$scope.closeDeleteCharAlert();
			$scope.showDeleteCharWarning = false;
			$scope.DeleteCharModel = null;
		}
		
		
		$scope.cancelDeletingSkill = function () {
			$scope.closeDeleteSkillAlert();
			$scope.showDeleteSkillWarning = false;
			$scope.DeleteSkillModel = null;
		}
		
		
		$scope.beginEditChar = function () {
			$scope.showCharEditing = true;
		}
		
		
		$scope.endEditChar = function () {
			$("[id^=skillDetails_]").hide();
			$scope.showCharEditing = false;
		}
		
		
		$scope.initPopover = function (event) {
			event.target.popover();
		}
		
		
		$scope.closeDeleteCharAlert = function () {
			$('#deleteChar-modal').modal('hide');
		}
		
		
		$scope.closeDeleteSkillAlert = function () {
			$('#deleteSkill-modal').modal('hide');
		}
		
		
		$scope.toggleSkillDetails = function (div) {
			$("#skillDetails_" + div).toggle();
		}
		
		
		$scope.toggleNoteLayer = function (div) {
			if (!$scope.showCharEditing) {
				$("#noteLayer_" + div).toggle();
			}
		}
	});