/***																					***\

	Filename: app.js
	Author: CS455 Cyan

	Copyright (c) 2015 University of North Alabama

\***																					***/

(
	function(angular)
	{
		'use strict';

		angular.module
		(
			'Catalog',
			[
				'ngRoute',
				'ngResource',
				'ui.bootstrap',
				'ngSanitize'
			]
		).run
		(
			[
				'$http',
				'$rootScope',
				'$location',
				'$resource',
				'CatalogAPI',
				function($http, $rootScope, $location, $resource, CatalogAPI)
				{
					// This runs when this angular app is first loaded.
					
					$rootScope.categories = [];

					CatalogAPI.listTextSections(function(textSections){
						$rootScope.textSections = textSections;
					});
					
					CatalogAPI.listCategories(function(categories){
						$rootScope.categories = categories;
					});
					
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
					
					/*
						Function: $rootScope.goToDepartment
						Description: Navigate to a given department, passing it to the root scope so the data does not have to be fetched again from the API
						Input:
							department: object for department program is in
						Output:
							app navigates to specified department page
						Created: Tyler Yasaka 04/19/2016
						Modified:
					*/
					/*$rootScope.goToDepartment = function(category, department) {
						$rootScope.department = department;
						$location.path(
							'/programs/category/' +
							category._id +
							'/department/' +
							department._id
						);
					}*/
					
					/*
						Function: $rootScope.goToProgram
						Description: Navigate to a given program, passing it to the root scope so the data does not have to be fetched again from the API
						Input:
							department: object for department program is in
							program: the program object
						Output:
							app navigates to specified program page
						Created: Tyler Yasaka 04/19/2016
						Modified:
					*/
					/*$rootScope.goToProgram = function(category, department, program) {
						$rootScope.department = department;
						$rootScope.program = program;
						var path = '/programs/category/' + category._id;
						if(department) {
							path += '/department/' + department._id
						}
						path += '/program/' + program._id;
						$location.path(path);
					}*/
					
					/*
						Function: $rootScope.programTitle
						Description: Creates a program title based on its name and type (e.g. 'major')
						Input:
							program: program object
						Output:
							title (String)
						Created: Tyler Yasaka 04/17/2016
						Modified:
					*/
					$rootScope.programTitle = function(program) {
						var part1 = '';
						switch(program.type) {
							case 'major':
								part1 = 'Major in ';
								break;
							case 'minor':
								part1 = 'Minor in ';
								break;
							case 'certificate':
								part1 = 'Certificate in ';
								break;
						}
						return part1 + program.name;
					}
					
					/*
						Function: $rootScope.formatCredit
						Description: format credit for display based on min and max
						Input:
							hours: hours object with min and max properties
						Output:
							formatted credit (String)
						Created: Tyler Yasaka 04/17/2016
						Modified:
					*/
					$rootScope.formatCredit = function(hours) {
						var credit;
						if(hours.min == hours.max) {
							credit = String(hours.min);
						}
						else {
							credit = hours.min + ' - ' + hours.max;
						}
						return credit;
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
