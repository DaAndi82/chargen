angular.module('chargen', ['ngRoute', 'overview', 'users'])
    
    .config(function($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/'});
    });
 
    /*.value('fbURL', 'https://chargen.firebaseio.com/')
    .service('fbRef', function(fbURL) {
        return new Firebase(fbURL)
    })*/