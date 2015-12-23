angular.module('chargen.overview', ['ngRoute'])

    .config(function($routeProvider) {
        $routeProvider.when('/', {
			templateUrl: 'pages/overview.html'
			});
    });