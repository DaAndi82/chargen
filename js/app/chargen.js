angular.module('chargen', ['ngRoute', 'overview'])
    
    
    /*.config(function($routeProvider) {
        var resolveProjects = {
            projects: function (Projects) {
                return Projects.fetch();
            }
        };
        
        $routeProvider.otherwise({redirectTo:'/overview'});
    })*/
    
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/overview'});
    }]);
 
    /*.value('fbURL', 'https://chargen.firebaseio.com/')
    .service('fbRef', function(fbURL) {
        return new Firebase(fbURL)
    })*/
    
    