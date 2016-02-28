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
	
	.controller('CharController',  function ($scope, $rootScope, $state, charService, alertService) {
		
		/* Hält den AlertService. */
		$scope.alertService = alertService;
		/* Hält die Liste der Chars (nicht das FirebaseArray). */
		$scope.charList = null;
		
		$rootScope.$watch('profil', function () {
			if ($scope.charList == null && $rootScope.profil != null) {
				charService.init(function () {
					$scope.charList = charService.getCharList();
				});
			}
		});
		
		
		$scope.createChar = function () {
			var charModel = {
				char: {
					name: 'NewChar'
				},
				initiator: $rootScope.profil.$id
			};
			
			charService.createChar(charModel, function () {
				alertService.addAlert({
					type: 'success',
					text: 'Einen neuen Char erstellt.'
				});
			});
		}
	});