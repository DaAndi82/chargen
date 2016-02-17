angular.module('chargen.alertService', [])

	.factory('alertService', function ($timeout) {
	
		var alertService = this;		
		alertService.alerts = [];
		
		
		alertService.addAlert = function (alert) {
			if (alert !== null && alert !== undefined && alert.constructor === {}.constructor) {	
			
				if (alert.scope === undefined || alert.scope === null) 
					alert.scope = "globalScope";
				if (alert.timeout === undefined || alert.timeout === null) 
					alert.timeout = 5000;
				if (alert.closeable === undefined || alert.closeable === null) 
					alert.closeable = true;
					
				alert.icon = null;
				alert.class = null;
			
				switch (alert.type) {
					case 'info':
						alert.icon = alert.type;
						alert.class = alert.type;
					break;
					
					case 'warning':
						alert.icon = alert.type;
						alert.class = alert.type;
					break;
					
					case 'error':
						alert.icon = 'ban';
						alert.class = 'danger'
					break;
					
					case 'success':
						alert.icon = 'check';
						alert.class = alert.type;
					break;
				}
				
				if (alertService.alerts[alert.scope] == null) alertService.alerts[alert.scope] = [];
				
				alertService.alerts[alert.scope].push(alert); 
				
				if (alert.timeout > 0) {
					$timeout(function () {
						alertService.deleteAlert(alert.scope, alertService.alerts[alert.scope].indexOf(alert));
					}, alert.timeout);
				}
			}
		}
		
		
		alertService.deleteAlert = function (scope, index) {
			alertService.alerts[scope].splice(index, 1);
		}
		
		return alertService;
	});