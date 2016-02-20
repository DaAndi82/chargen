angular.module('chargen.overview', [
		'ui.router',
		'chargen.alertService'
	])

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
    })
	
	.controller('OverviewController',  function ($scope, alertService) {
		
		/* Hält den AlertService. */
		$scope.alertService = alertService;
	});