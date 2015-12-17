angular.module('overview', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
			templateUrl: 'pages/overview.html'
			});
    }]);