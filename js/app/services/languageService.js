angular.module('chargen.languageService',[
		'firebase'
		'pascalprecht.translate',
	])
	
	.config(function($translateProvider, $translatePartialLoaderProvider) {
		$translateProvider.useLoader('$translatePartialLoader', {
		  urlTemplate: '/i18n/{part}/{lang}.json'
		});
		
		$translateProvider.preferredLanguage('en');
		$translateProvider.fallbackLanguage('en');
	})
	
    .factory('languageService', function($translatePartialLoader) {
	
		var languageService = this;
		var messages = {
			de: null,
			en: null
		}
		
		languageService.messageBundle = null;
		
		languageService.chooseLanguage = function (lang) {
		
			switch (lang) {
				case 'de':
					languageService.messageBundle = messages.de
				break;
				
				case 'en':
					languageService.messageBundle = messages.en
				break;
				
				default:
					languageService.messageBundle = messages.en
				break;
			}
		}
		
		
		
		return languageService;
    });