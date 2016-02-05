angular.module('chargen.alertService', [])

	.factory('alertService', function ($timeout) {
	
		var alertService = this;		
		alertService.alerts = [];
		
		
		alertService.addAlert = function (type, text) {
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
			alertService.alerts.push(alert); 
			
			$timeout(function () {
				alertService.deleteAlert(alertService.alerts.indexOf(alert));
			}, 5000);
		}
		
		
		alertService.deleteAlert = function (index) {
			alertService.alerts.splice(index, 1);
		}
		
		return alertService;
	});