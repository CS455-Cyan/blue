/***																					***\

	Filename: app.js
	Author: Mitchel R Moon

	Copyright (c) 2015 University of North Alabama

\***																					***/

(
	function(angular)
	{
		'use strict';

		angular.module
		(
			'AppAdmin',
			[
				'ngRoute',
				'ngResource',
				'ngCookies',
				'ngFileUpload',
				'ui.bootstrap',
				'ngSanitize',
                'ui.sortable',
                'checklist-model'
			]
		).run
		(
			[
				'$http',
				'$rootScope',
				'$location',
				'$resource',
				function($http, $rootScope, $location, $resource)
				{
					var logoutAPI = $resource('/admin/logout');
					var sessionAPI = $resource('/admin/session');

					$rootScope.apps = [];
					
					$rootScope.verifyPassword = function(password, confirmPassword) {
						// Edit to return false on invalid password or when
						// password and confirmPassword don't match.
						// - 8-12 characters
						// - at least one uppercase
						// - at least one lowercase
						// - no special characters
						return true;
					}

					$rootScope.logout =
						function()
						{
							logoutAPI.get
							(
								{},
								function()
								{
									$rootScope.isLoggedIn = false;
									$location.path('/login');
								}
							);
						};

					$rootScope.checkLogin =
						function()
						{
						
							var apiSession = sessionAPI.get
							(
								{},
								function()
								{
									if(apiSession.authenticated === false)
									{
										$rootScope.isLoggedIn = false;
										$location.path('/login')
									}
									else{
										$rootScope.isLoggedIn = true;
										$rootScope.apps = apiSession.apps;
										$rootScope.username = apiSession.username;
										$rootScope._id = apiSession._id;
									}
								}
							);
						}
					
					/*
						Function: $rootScope.isActivePath
						Description: Tells whether or not the given path is active
						Input:
							path: path to check (String)
						Output:
							whether path is active (Boolean)
						Created: Tyler Yasaka 04/17/2016
						Modified:
					*/
					$rootScope.isActivePath = function(path) {
						return ($location.path().substr(0, path.length) === path);
					}

					$rootScope.$on('$routeChangeSuccess',
						function ()
						{
							$rootScope.checkLogin();
						}
					);

					/*==																					==*\
						@name: assumeLocalTime

						@parameters:
							datestring: (String) string representation of date

						@description:
							*For use in retrieving dates from database*
							When we are getting date from database, we are getting a time that is specified in UTC time.
							However, Javascript will try to "do us a favor" and convert the time into whatever the user's browser's timezime is set to.
							We don't want that. We want a single time to display to all user's, no matter where in the world they happen to be (because UNA will always be in just one timezone).
							So we've got to counteract Javascript's over-eagerness to help us out.

						@return: (Date) converted date
					\*==																					==*/
					$rootScope.assumeLocalTime =
						function(datestring){
							var date = new Date(datestring);
							date = new Date( date.getTime() + ( date.getTimezoneOffset() * 60000 ) );
							return date;
						}

					/*==																					==*\
						@name: convertToLocalTime

						@parameters:
							date: (Date) date to convert

						@description:
							*For use in sending dates to database*
							We want to store the exact date that the user sees in his/her browser when selecting a date.
							However, Javascript will try do "do us a favor" and convert the date dispayed to the user into UTC time, taking into account the user's timezone.
							In other words, we will get back different dates depending on what timezone the user's computer happens to be set to.
							We don't want that. We want to know exactly what time is specified by the user, no matter where in the world they happen to be (because UNA will always be in just one timezone).
							So we've got to counteract Javascript's over-eagerness to help us out.

						@return: (Date) converted date
					\*==																					==*/
					$rootScope.convertToLocalTime =
			      function(date){
			      	return new Date(date.getTime() - date.getTimezoneOffset()*60000);
			      }
				}
			]
		).service(
			'CatalogAPI',
			CatalogAPIService
		);
	}
)
(
	angular
);


