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
	
	.filter('orderObjectBy', function () {
		return function (input, attribute) {
			if (!angular.isObject(input)) return input;

			var array = [];
			for(var objectKey in input) {
				array.push(input[objectKey]);
			}

			array.sort(function(a, b){
				if(a[attribute] < b[attribute]) return -1;
				if(a[attribute] > b[attribute]) return 1;
				return 0;
			});
			
			return array;
		}
	})
	
	.filter('replaceBBCode', function () {
		return function (input) {
			input = input.replace(/\[(ABILITY)\]/gi, '<img src="img/dice/ability.png" class="descDice"/>');
			input = input.replace(/\[(AB)\]/gi, '<img src="img/dice/ability.png" class="descDice"/>');
			input = input.replace(/\[(ADVANTAGE)\]/gi, '<img src="img/dice/advantage.png" class="descDice"/>');
			input = input.replace(/\[(AD)\]/gi, '<img src="img/dice/advantage.png" class="descDice"/>');
			input = input.replace(/\[(BOOST)\]/gi, '<img src="img/dice/boost.png" class="descDice"/>');
			input = input.replace(/\[(BO)\]/gi, '<img src="img/dice/boost.png" class="descDice"/>');
			input = input.replace(/\[(CHALLENGE)\]/gi, '<img src="img/dice/challenge.png" class="descDice"/>');
			input = input.replace(/\[(CH)\]/gi, '<img src="img/dice/challenge.png" class="descDice"/>');
			input = input.replace(/\[(DARK)\]/gi, '<img src="img/dice/darkside.png" class="descDice"/>');
			input = input.replace(/\[(DA)\]/gi, '<img src="img/dice/darkside.png" class="descDice"/>');
			input = input.replace(/\[(DESPAIR)\]/gi, '<img src="img/dice/despair.png" class="descDice black"/>');
			input = input.replace(/\[(DE)\]/gi, '<img src="img/dice/despair.png" class="descDice black"/>');
			input = input.replace(/\[(DIFFICULTY)\]/gi, '<img src="img/dice/difficulty.png" class="descDice"/>');
			input = input.replace(/\[(DI)\]/gi, '<img src="img/dice/difficulty.png" class="descDice"/>');
			input = input.replace(/\[(FAILURE)\]/gi, '<img src="img/dice/failure.png" class="descDice black"/>');
			input = input.replace(/\[(FA)\]/gi, '<img src="img/dice/failure.png" class="descDice black"/>');
			input = input.replace(/\[(FORCE)\]/gi, '<img src="img/dice/force.png" class="descDice"/>');
			input = input.replace(/\[(FO)\]/gi, '<img src="img/dice/force.png" class="descDice"/>');
			input = input.replace(/\[(LIGHT)\]/gi, '<img src="img/dice/lightside.png" class="descDice"/>');
			input = input.replace(/\[(LI)\]/gi, '<img src="img/dice/lightside.png" class="descDice"/>');
			input = input.replace(/\[(PROFICIENCY)\]/gi, '<img src="img/dice/proficiency.png" class="descDice"/>');
			input = input.replace(/\[(PR)\]/gi, '<img src="img/dice/proficiency.png" class="descDice"/>');
			input = input.replace(/\[(SETBACK)\]/gi, '<img src="img/dice/setback.png" class="descDice"/>');
			input = input.replace(/\[(SE)\]/gi, '<img src="img/dice/setback.png" class="descDice"/>');
			input = input.replace(/\[(SUCCESS)\]/gi, '<img src="img/dice/success.png" class="descDice"/>');
			input = input.replace(/\[(SU)\]/gi, '<img src="img/dice/success.png" class="descDice"/>');
			input = input.replace(/\[(THREAT)\]/gi, '<img src="img/dice/threat.png" class="descDice black"/>');
			input = input.replace(/\[(TH)\]/gi, '<img src="img/dice/threat.png" class="descDice black"/>');
			input = input.replace(/\[(TRIUMPH)\]/gi, '<img src="img/dice/triumph.png" class="descDice"/>');
			input = input.replace(/\[(TR)\]/gi, '<img src="img/dice/triumph.png" class="descDice"/>');
		
			return input;
		}
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
		/* DeleteWeaponModel für die Delete-Maske */
		$scope.DeleteWeaponModel = null;
		/* DeleteTalentModel für die Delete-Maske */
		$scope.DeleteTalentModel = null;
		/* Triggert das DeleteCharWarning .*/
		$scope.showDeleteCharWarning = false;
		/* Triggert das DeleteSkillWarning .*/
		$scope.showDeleteSkillWarning = false;
		/* Triggert das DeleteWeaponWarning .*/
		$scope.showDeleteWeaponWarning = false;
		/* Triggert das DeleteTalentWarning .*/
		$scope.showDeleteTalentWarning = false;
		/* Triggert das Bearbeiten eines Chars .*/
		$scope.showCharEditing = false;
		/*Zeigt den Avatar-Edit-Bereich im Profil an. */
		$scope.showCharImageEditing = false;
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
		
		$scope.choosableSkillsForWeapons = {
		
		};
		
		$scope.choosableRangeForWeapons = {
			engaged: {value: "engaged", text: "", i18n: "range.engaged"},
			short: {value: "short", text: "", i18n: "range.short"},
			medium: {value: "medium", text: "", i18n: "range.medium"},
			long: {value: "long", text: "", i18n: "range.long"},
			extreme: {value: "extreme", text: "", i18n: "range.extreme"}
		};
		
		$scope.choosableActivationsForTalents = {
			maneuver: {value: "maneuver", text: "", i18n: "activation.maneuver"},
			incidental: {value: "incidental", text: "", i18n: "activation.incidental"},
			passive: {value: "passive", text: "", i18n: "activation.passive"}
		};
		
		
		/*$scope.translateAttribute = function (attributeI18N) {
			$translate(attributeI18N).then(function (attribute) {
				$scope.namespaced_paragraph = attribute;
			});
		}*/
		
		
		$rootScope.$on('$translateChangeSuccess', function () {
			$scope.setChoosableValuesForSelectFields();
		});

		
		$rootScope.$watch('profil', function () {
			if ($rootScope.charList == null && $rootScope.profil != null) {
				charService.init(function () {
					$rootScope.charList = charService.getCharList();
				});
			}
		});
		
		
		$scope.setChoosableValuesForSelectFields = function () {
			// Für "choosableAttributes"
			jQuery.each($scope.choosableAttributes, function(key, attribute) {
				$translate(attribute.i18n).then(function (translation) {
					attribute.text = translation;
				});
			});
			
			// Für "choosableSkillsForWeapons"
			if ($scope.SelectedCharModel != null) {
				jQuery.each($scope.SelectedCharModel.char.skills.battle, function(key, skill) {
					$scope.choosableSkillsForWeapons[key] = {
						value: key,
						i18n: skill.i18n
					};
					
					$translate($scope.choosableSkillsForWeapons[key].i18n).then(function (translation) {
						$scope.choosableSkillsForWeapons[key].text = translation;
					});
				});
				if ($scope.SelectedCharModel.char.skills.custom) {
					jQuery.each($scope.SelectedCharModel.char.skills.custom, function(key, skill) {
						$scope.choosableSkillsForWeapons[key] = {
							value: key,
							text: skill.name
						}
					});
				}
			}
				
			// Für "choosableRangeForWeapons"
			jQuery.each($scope.choosableRangeForWeapons, function(key, range) {
				$translate(range.i18n).then(function (translation) {
					range.text = translation;
				});
			});
				
			// Für "choosableActivationsForTalents"
			jQuery.each($scope.choosableActivationsForTalents, function(key, activation) {
				$translate(activation.i18n).then(function (translation) {
					activation.text = translation;
				});
			});
		}
		
		
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
				
				jQuery.each($scope.SelectedCharModel.char.equipment.weapons, function(key, weapon) {
					if (weapon.skill.name == $scope.DeleteSkillModel.key) {
						if (weapon.skill.name) weapon.skill.name = "";
						if (weapon.skill.i18n) weapon.skill.i18n = "";
						if (weapon.skill.text) weapon.skill.text = "";
					}
				});
				
				delete $scope.choosableSkillsForWeapons[$scope.DeleteSkillModel.key];
				delete $rootScope.SelectedCharModel.char.skills.custom[$scope.DeleteSkillModel.key];
				$scope.slideDownSkills();
				
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
		
		
		$scope.removeWeapon = function () {
			if ($scope.DeleteWeaponModel != null) {
				delete $rootScope.SelectedCharModel.char.equipment.weapons[$scope.DeleteWeaponModel.key];
				$scope.slideDownWeapons();
				
				$scope.updateChar(function (error) {
					if (error) {
						alertService.addAlert({
							type: 'error',
							text: 'Es ist ein Fehler aufgetreten. Die Waffe "' + $scope.DeleteWeaponModel.name + '" konnte nicht gelöscht werden.'
						});
					}
					
					$scope.DeleteWeaponModel = null;
				});
					
				$scope.closeDeleteWeaponAlert();
			}
		}
		
		
		$scope.removeTalent = function () {
			if ($scope.DeleteTalentModel != null) {
				delete $rootScope.SelectedCharModel.char.talents[$scope.DeleteTalentModel.key];
				
				$scope.updateChar(function (error) {
					if (error) {
						alertService.addAlert({
							type: 'error',
							text: 'Es ist ein Fehler aufgetreten. Das Talent "' + $scope.DeleteTalentModel.name + '" konnte nicht gelöscht werden.'
						});
					}
					
					$scope.DeleteTalentModel = null;
				});
					
				$scope.closeDeleteTalentAlert();
			}
		}
		
		
		$scope.moveUpWeapon = function (index) {
			if (index < 9) {
				var oldIndex = "weapon0" + (index + 1);
				var newIndex = "weapon0" + index;
			} else {
				var oldIndex = "weapon" + (index + 1);
				if (index == 9) {
					var newIndex = "weapon09";
				} else {
					var newIndex = "weapon" + index;
				}
			}
		
			var oldWeapon = angular.copy($rootScope.SelectedCharModel.char.equipment.weapons[newIndex]);
			$rootScope.SelectedCharModel.char.equipment.weapons[newIndex] = angular.copy($rootScope.SelectedCharModel.char.equipment.weapons[oldIndex]);
			$rootScope.SelectedCharModel.char.equipment.weapons[oldIndex] = oldWeapon;
			
			var oldWeaponDetailsShown = $("#weaponDetails_" + index).is(":visible");
			var oldEquipmentWeaponDetailsShown = $("#equipmentWeaponDetails_" + index).is(":visible");
			var newWeaponDetailsShown = $("#weaponDetails_" + (index - 1)).is(":visible");
			var newEquipmentWeaponDetailsShown = $("#equipmentWeaponDetails_" + (index - 1)).is(":visible");
			
			if (oldWeaponDetailsShown) {
				$("#weaponDetails_" + (index - 1)).show();
			} else {
				$("#weaponDetails_" + (index - 1)).hide();
			}
			if (newWeaponDetailsShown) {
				$("#weaponDetails_" + index).show();
			} else {
				$("#weaponDetails_" + index).hide();
			}
			
			if (oldEquipmentWeaponDetailsShown) {
				$("#equipmentWeaponDetails_" + (index - 1)).show();
			} else {
				$("#equipmentWeaponDetails_" + (index - 1)).hide();
			}
			if (newEquipmentWeaponDetailsShown) {
				$("#equipmentWeaponDetails_" + index).show();
			} else {
				$("#equipmentWeaponDetails_" + index).hide();
			}
			
			$scope.updateChar();
		}
		
		
		$scope.moveDownWeapon = function (index) {
			if (index < 9) {
				var oldIndex = "weapon0" + (index + 1);
				if (index == 8) {
					var newIndex = "weapon10";
				} else {
					var newIndex = "weapon0" + (index + 2);
				}
			} else {
				var oldIndex = "weapon" + (index + 1);
				var newIndex = "weapon" + (index + 2);
			}
		
			var oldWeapon = angular.copy($rootScope.SelectedCharModel.char.equipment.weapons[newIndex]);
			$rootScope.SelectedCharModel.char.equipment.weapons[newIndex] = angular.copy($rootScope.SelectedCharModel.char.equipment.weapons[oldIndex]);
			$rootScope.SelectedCharModel.char.equipment.weapons[oldIndex] = oldWeapon;
			
			var oldWeaponDetailsShown = $("#weaponDetails_" + index).is(":visible");
			var oldEquipmentWeaponDetailsShown = $("#equipmentWeaponDetails_" + index).is(":visible");
			var newWeaponDetailsShown = $("#weaponDetails_" + (index + 1)).is(":visible");
			var newEquipmentWeaponDetailsShown = $("#equipmentWeaponDetails_" + (index + 1)).is(":visible");
			
			if (oldWeaponDetailsShown) {
				$("#weaponDetails_" + (index + 1)).show();
			} else {
				$("#weaponDetails_" + (index + 1)).hide();
			}
			if (newWeaponDetailsShown) {
				$("#weaponDetails_" + index).show();
			} else {
				$("#weaponDetails_" + index).hide();
			}
			
			if (oldEquipmentWeaponDetailsShown) {
				$("#equipmentWeaponDetails_" + (index + 1)).show();
			} else {
				$("#equipmentWeaponDetails_" + (index + 1)).hide();
			}
			if (newEquipmentWeaponDetailsShown) {
				$("#equipmentWeaponDetails_" + index).show();
			} else {
				$("#equipmentWeaponDetails_" + index).hide();
			}
			
			$scope.updateChar();
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
			
			$scope.setChoosableValuesForSelectFields();
		}
		
		
		$scope.checkNumberNotNull = function (self) {
			if (!self.$data) self.$data = 0;
		}
		
		
		$scope.checkStringNotNull = function (self) {
			if (!self.$data) self.$data = "";
		}
		
		
		$scope.checkStringNotNullAndRenameSkill= function (index, self) {
			if (!self.$data) {
				self.$data = "";
			} else {
				jQuery.each($scope.SelectedCharModel.char.equipment.weapons, function(key, weapon) {
					if (weapon.skill.name == "skill" + (index + 1)) {
						weapon.skill.text = self.$data;
					}
				});
			}			
		}
		
		
		$scope.i18nForCustomSkillAttribute = function (skill, self) {
			if (skill && self.$data) {
				skill.attribute.i18n = $scope.choosableAttributes[self.$data].i18n;
				skill.attribute.i18nSmall = $scope.choosableAttributes[self.$data].i18nSmall;
			}
		}
		
		
		$scope.i18nForWeaponSkill = function (weapon, self) {
			if (weapon && self.$data) {
				// Prüft ob i18n vorhanden - nicht bei customSkills
				if ($scope.choosableSkillsForWeapons[self.$data].i18n != null) {
					delete weapon.skill.text;
					weapon.skill.i18n = $scope.choosableSkillsForWeapons[self.$data].i18n;
				} else {
					delete weapon.skill.i18n;
					weapon.skill.text = $scope.choosableSkillsForWeapons[self.$data].text;
				}
			}
		}
		
		
		$scope.i18nForWeaponRange = function (weapon, self) {
			if (weapon && self.$data) {
				weapon.range.i18n = $scope.choosableRangeForWeapons[self.$data].i18n;
			}
		}
		
		
		$scope.i18nForTalentActivation = function (talent, self) {
			if (talent && self.$data) {
				talent.activation.i18n = $scope.choosableActivationsForTalents[self.$data].i18n;
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
		
		
		$scope.getProficiencyCountForWeapon = function (weapon) {
			var diceCount = 0;
			
			if (weapon.skill.name != "") {
				
				if ($rootScope.SelectedCharModel.char.skills.battle[weapon.skill.name] != null) {
					var skill = $rootScope.SelectedCharModel.char.skills.battle[weapon.skill.name];
					diceCount = $scope.getProficiencyCountForSkill(skill);
				} else if ($rootScope.SelectedCharModel.char.skills.custom[weapon.skill.name] != null) {
					var skill = $rootScope.SelectedCharModel.char.skills.custom[weapon.skill.name];
					diceCount = $scope.getProficiencyCountForSkill(skill);
				}
			}
			
			diceCount += weapon.modifications.proficiency;
			
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
		
		
		$scope.getAbilityCountForWeapon = function (weapon) {
			var diceCount = 0;
			
			if (weapon.skill.name != "") {
				if ($rootScope.SelectedCharModel.char.skills.battle[weapon.skill.name] != null) {
					var skill = $rootScope.SelectedCharModel.char.skills.battle[weapon.skill.name];
					diceCount = $scope.getAbilityCountForSkill(skill);
				} else if ($rootScope.SelectedCharModel.char.skills.custom[weapon.skill.name] != null) {
					var skill = $rootScope.SelectedCharModel.char.skills.custom[weapon.skill.name];			
					diceCount = $scope.getAbilityCountForSkill(skill);
				}
			}
			
			diceCount += weapon.modifications.ability;
			
			return diceCount;
		}
		
		
		$scope.updateChar = function (callback) {
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
				} else {
					$scope.setChoosableValuesForSelectFields();
					if (callback)  callback();
				}
			});
		}
		
		
		$scope.newSkill = function () {
			if ($rootScope.SelectedCharModel != null) {
				if ($rootScope.SelectedCharModel.char.skills.custom == null) {
					$rootScope.SelectedCharModel.char.skills.custom = {};
				}
				
				var customSkillCount = Object.keys($rootScope.SelectedCharModel.char.skills.custom).length;
				
				if (customSkillCount < 9) {
					var stringIndex = "skill0" + (customSkillCount + 1);
				} else {
					var stringIndex = "skill" + (customSkillCount + 1);
				}
				
				$rootScope.SelectedCharModel.char.skills.custom[stringIndex] = {
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
				
				$scope.updateChar();
			}
		}
		
		
		$scope.newWeapon = function (equipWeapon) {
			if ($rootScope.SelectedCharModel != null) {
				if ($rootScope.SelectedCharModel.char.equipment == null) $rootScope.SelectedCharModel.char.equipment = {};
				if ($rootScope.SelectedCharModel.char.equipment.weapons == null) $rootScope.SelectedCharModel.char.equipment.weapons = {};
				
				var weaponCount = Object.keys($rootScope.SelectedCharModel.char.equipment.weapons).length;
				
				if (weaponCount < 9) {
					var stringIndex = "weapon0" + (weaponCount + 1);
				} else {
					var stringIndex = "weapon" + (weaponCount + 1);
				}
				
				$rootScope.SelectedCharModel.char.equipment.weapons[stringIndex] = {
					name: "",
					skill: {
						name: "",
						i18n: ""
					},
					range: {
						name: "",
						i18n: ""
					},
					held: false,
					equip: false,
					own: true,
					damage: 0,
					crit: 0,
					specialSmall: "",
					specialLarge: "",
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
					},
					note: "",
				}
				
				if (equipWeapon) {
					$rootScope.SelectedCharModel.char.equipment.weapons[stringIndex].equip = true;
				}
				
				$scope.updateChar();
			}
		}
		
		
		$scope.newTalent = function () {
			if ($rootScope.SelectedCharModel != null) {
				if ($rootScope.SelectedCharModel.char.talents == null) $rootScope.SelectedCharModel.char.talents = {};
				
				var talentCount = Object.keys($rootScope.SelectedCharModel.char.talents).length;
				
				if (talentCount < 9) {
					var stringIndex = "talent0" + (talentCount + 1);
				} else {
					var stringIndex = "talent" + (talentCount + 1);
				}
				
				$rootScope.SelectedCharModel.char.talents[stringIndex] = {
					name: "",
					rank: 0,
					activation: {
						name: "",
						i18n: ""
					},
					acquisition: "",
					description: "",
					note: "",
				}
				
				$scope.updateChar();
			}
		}
		
		
		$scope.duplicateWeapon = function (weapon) {
			if (weapon != null) {
				var weaponCount = Object.keys($rootScope.SelectedCharModel.char.equipment.weapons).length;
				
				if (weaponCount < 9) {
					var stringIndex = "weapon0" + (weaponCount + 1);
				} else {
					var stringIndex = "weapon" + (weaponCount + 1);
				}
				
				$rootScope.SelectedCharModel.char.equipment.weapons[stringIndex] = angular.copy(weapon);
				$scope.updateChar();
			}
		}
		
		
		$scope.slideDownSkills = function () {
			var index = 1;
			var skills = angular.copy($scope.SelectedCharModel.char.skills.custom);
			
			jQuery.each(skills, function(key, skill) {
				if (index < 10) {
					var stringIndex = "skill0" + index;
				} else {
					var stringIndex = "skill" + index;
				}
				
				if (key != stringIndex && $scope.SelectedCharModel.char.skills.custom[stringIndex] == undefined) {
					$scope.SelectedCharModel.char.skills.custom[stringIndex] = skill;
					delete $scope.SelectedCharModel.char.skills.custom[key];
				}
				
				index++;
			});
		}
		
		
		$scope.slideDownWeapons = function () {
			var index = 1;
			var weapons = angular.copy($scope.SelectedCharModel.char.equipment.weapons);
			
			jQuery.each(weapons, function(key, weapon) {
				if (index < 10) {
					var stringIndex = "weapon0" + index;
				} else {
					var stringIndex = "weapon" + index;
				}
				
				if (key != stringIndex && $scope.SelectedCharModel.char.equipment.weapons[stringIndex] == undefined) {
					$scope.SelectedCharModel.char.equipment.weapons[stringIndex] = weapon;
					delete $scope.SelectedCharModel.char.equipment.weapons[key];
				}
				
				index++;
			});
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
			if (index < 9) {
				var stringIndex = "skill0" + (index + 1);
			} else {
				var stringIndex = "skill" + (index + 1);
			}
		
			$scope.DeleteSkillModel = {
				key: stringIndex,
				name: angular.copy($rootScope.SelectedCharModel.char.skills.custom[stringIndex].name)
			}
			
			if ($scope.DeleteSkillModel != null) {
				$scope.showDeleteSkillWarning = true;
			}
		}
		
		
		$scope.deleteWeapon = function (index) {
			if (index < 9) {
				var stringIndex = "weapon0" + (index + 1);
			} else {
				var stringIndex = "weapon" + (index + 1);
			}
			
			$scope.DeleteWeaponModel = {
				key: stringIndex,
				name: angular.copy($rootScope.SelectedCharModel.char.equipment.weapons[stringIndex].name)
			}
			
			if ($scope.DeleteWeaponModel != null) {
				$scope.showDeleteWeaponWarning = true;
			}
		}
		
		
		$scope.deleteTalent = function (index) {
			if (index < 9) {
				var stringIndex = "talent0" + (index + 1);
			} else {
				var stringIndex = "talent" + (index + 1);
			}
			
			$scope.DeleteTalentModel = {
				key: stringIndex,
				name: angular.copy($rootScope.SelectedCharModel.char.talents[stringIndex].name)
			}
			
			if ($scope.DeleteTalentModel != null) {
				$scope.showDeleteTalentWarning = true;
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
		
		
		$scope.cancelDeletingWeapon = function () {
			$scope.closeDeleteWeaponAlert();
			$scope.showDeleteWeaponWarning = false;
			$scope.DeleteWeaponModel = null;
		}
		
		
		$scope.cancelDeletingTalent = function () {
			$scope.closeDeleteTalentAlert();
			$scope.showDeleteTalentWarning = false;
			$scope.DeleteTalentModel = null;
		}
		
		
		$scope.beginEditCharImage = function () {
			$scope.showCharImageEditing = true;
			$scope.SelectedCharModel.cropedCharImage = null;
		}
		
		
		$scope.changeCharImage = function () {
			$scope.SelectedCharModel.char.image = $scope.SelectedCharModel.cropedCharImage;
			$scope.updateChar();
			$scope.SelectedCharModel.editCharImage = null;
			$scope.showCharImageEditing = false;
		}
		
		
		$scope.endEditCharImage = function () {
			$scope.SelectedCharModel.editCharImage = null;
			$scope.showCharImageEditing = false;
		}
		
		
		$scope.beginEditChar = function () {
			$scope.showCharEditing = true;
		}
		
		
		$scope.endEditChar = function () {
			$("[id^=skillDetails_]").hide();
			$("[id^=weaponDetails_]").hide();
			$("[id^=talentDetails_]").hide();
			$("[id^=equipmentWeaponDetails_]").hide();
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
		
		
		$scope.closeDeleteWeaponAlert = function () {
			$('#deleteWeapon-modal').modal('hide');
		}
		
		
		$scope.closeDeleteTalentAlert = function () {
			$('#deleteTalent-modal').modal('hide');
		}
		
		
		$scope.toggleSkillDetails = function (index) {
			$("#skillDetails_" + index).toggle();
		}
		
		
		$scope.toggleWeaponDetails = function (index) {
			$("#weaponDetails_" + index).toggle();
		}
		
		
		$scope.toggleTalentDetails = function (index) {
			$("#talentDetails_" + index).toggle();
		}
		
		
		$scope.toggleEquipmentWeaponDetails = function (index) {
			$("#equipmentWeaponDetails_" + index).toggle();
		}
		
		
		$scope.toggleNoteLayer = function (div) {
			if (!$scope.showCharEditing) {
				$("#noteLayer_" + div).toggle();
			}
		}
	});