angular.module('overview', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/overview', {
        templateUrl: 'pages/overview.html',
        controller: 'overviewControler'
    })
    
    .controller('overviewControler', [function() {
        
    }]);
}])