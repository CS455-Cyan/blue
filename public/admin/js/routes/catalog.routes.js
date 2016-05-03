/***																					***\

	Filename: catalog.routes.js
	Author: CS455 Cyan

	Copyright (c) 2015 University of North Alabama
	
\***																					***/

(
	function(angular)
	{
		'use strict';

		angular.module('AppAdmin')
		.config
		(
			[
				'$routeProvider',
				function($routeProvider)
				{
					$routeProvider.when
					(
						'/catalog',
						{
							templateUrl: 'views/catalog/index.html',
							controller: 'Catalog-HomeCtrl'
						}
					).when
					(
						'/catalog/text-sections',
						{
							templateUrl: 'views/catalog/text-sections/list.html',
							controller: 'Catalog-TextSectionListCtrl'
						}
					).when
					(
						'/catalog/text-sections/:id',
						{
							templateUrl: 'views/catalog/text-sections/edit.html',
							controller: 'Catalog-TextSectionEditCtrl'
						}
					).when
					(
						'/catalog/programs/categories',
						{
							templateUrl: 'views/catalog/programs/categories.html',
							controller: 'Catalog-CategoriesCtrl'
						}
					).when
					(
						'/catalog/programs/departments/:categoryID/:departmentID',
						{
							templateUrl: 'views/catalog/programs/departments.html',
							controller: 'Catalog-DepartmentsCtrl'
						}
					).when
					(
						'/catalog/programs/programs/:categoryID/:programID',
						{
							templateUrl: 'views/catalog/programs/programs.html',
							controller: 'Catalog-ProgramsCtrl'
						}
					).when
					(
						'/catalog/programs/programs/:categoryID/:departmentID/:programID',
						{
							templateUrl: 'views/catalog/programs/programs.html',
							controller: 'Catalog-ProgramsCtrl'
						}
					).when
					(
						'/catalog/general-requirements',
						{
							templateUrl: 'views/catalog/general-requirements.html',
							controller: 'Catalog-General-RequirementsCtrl'
						}
					).when
					(
						'/catalog/courses',
						{
							templateUrl: 'views/catalog/courses.html',
							controller: 'Catalog-CoursesCtrl'
						}
					).when
					(
						'/catalog/faculty-and-staff',
						{
							templateUrl: 'views/catalog/faculty-and-staff.html',
							controller: 'Catalog-FacultyAndStaffCtrl'
						}
					).when
					(
						'/catalog/change-requests',
						{
							templateUrl: 'views/catalog/change-requests/index.html',
							controller: 'Catalog-ChangeRequestsCtrl'
						}
					).when
					(
						'/catalog/account',
						{
							templateUrl: 'views/catalog/account.html',
							controller: 'Catalog-AccountCtrl'
						}
					).when
					(
						'/catalog/admins',
						{
							templateUrl: 'views/catalog/admins/list.html',
							controller: 'Catalog-AdminListCtrl'
						}
					).when
					(
						'/catalog/publish',
						{
							templateUrl: 'views/catalog/publish.html',
							controller: 'Catalog-PublishCtrl'
						}
					);
				}
			]
		);

	}
)
(
	angular
);
