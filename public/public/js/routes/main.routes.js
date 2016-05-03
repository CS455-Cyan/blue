/***																					***\

	Filename: routes.js
	Author: CS455 Cyan

	Copyright (c) 2015 University of North Alabama
	
\***																					***/

(
	function(angular)
	{
		'use strict';

		angular.module('Catalog')
		.config
		(
			[
				'$routeProvider',
				function($routeProvider)
				{
					$routeProvider.when
					(
						'/',
						{
							templateUrl: 'views/home.html',
							controller: 'HomeCtrl'
						}
					).when
					(
						'/about',
						{
							templateUrl: 'views/home.html',
							controller: 'HomeCtrl'
						}
					).when
					(
						'/section/:section',
						{
							templateUrl: 'views/section.html',
							controller: 'TextSectionCtrl'
						}
					).when
					(
						'/general-requirements',
						{
							templateUrl: 'views/general-requirements.html',
							controller: 'GeneralRequirementsCtrl'
						}
					).when
					(
						'/programs/category/:category',
						{
							templateUrl: 'views/programs/category.html',
							controller: 'CategoryCtrl'
						}
					).when
					(	'/programs/category/:category/department/:department',
						{
							templateUrl: 'views/programs/department.html',
							controller: 'DepartmentCtrl'
						}
					).when
					(
						'/programs/category/:category/program/:program',
						{
							templateUrl: 'views/programs/program.html',
							controller: 'ProgramCtrl'
						}
					).when
					(
						'/programs/category/:category/department/:department/program/:program',
						{
							templateUrl: 'views/programs/program.html',
							controller: 'ProgramCtrl'
						}
					).when
					(
						'/courses',
						{
							templateUrl: 'views/courses/index.html',
							controller: 'CoursesCtrl'
						}
					).when
					(
						'/courses/course/:course',
						{
							templateUrl: 'views/courses/course.html',
							controller: 'CourseCtrl'
						}
					).when
					(
						'/courses/subject/:subject',
						{
							templateUrl: 'views/courses/subject.html',
							controller: 'SubjectCtrl'
						}
					).when
					(
						'/faculty-and-staff',
						{
							templateUrl: 'views/faculty-and-staff.html',
							controller: 'FacultyAndStaffCtrl'
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
