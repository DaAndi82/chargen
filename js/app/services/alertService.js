angular.module('chargen.alertService', [])

	.factory('alertService', function ($timeout) {
	
		var alertService = this;		
		alertService.alerts = [];
		
		
		alertService.addAlert = function (scope, type, text) {
			var alert = {icon: null, class: null, text: null};
		
			switch (type) {
				case 'info':
					alert.icon = type;
					alert.class = type;
				break;
				
				case 'warning':
					alert.icon = type;
					alert.class = type;
				break;
				
				case 'error':
					alert.icon = 'ban';
					alert.class = 'danger'
				break;
				
				case 'success':
					alert.icon = 'check';
					alert.class = type;
				break;
			}
			
			alert.text = text;
			
			if (alertService.alerts[scope] == null) alertService.alerts[scope] = [];
			
			alertService.alerts[scope].push(alert); 
			
			$timeout(function () {
				alertService.deleteAlert(scope, alertService.alerts[scope].indexOf(alert));
			}, 5000);
		}
		
		
		alertService.deleteAlert = function (scope, index) {
			alertService.alerts[scope].splice(index, 1);
		}
		
		return alertService;
	});