angular.module('chargen.overview', ['ui.router'])

    .config(function($stateProvider, $urlRouterProvider) {
		$stateProvider.state('overview', {
            url: '/overview',
            templateUrl: 'pages/overview.html',			
			resolve: {
				"currentAuth": ["authService", function(authService) {
					return authService.auth.$requireAuth();
				}]
			}
        })
    });