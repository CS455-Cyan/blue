/***																					***\

	Filename: main.controllers.js
	Author: CS455 Cyan

	Copyright (c) 2015 University of North Alabama

\***																					***/

angular.module('Catalog')
.controller
(
	'HomeCtrl',
	[
		'$scope',
		'$rootScope',
		'CatalogAPI',
        '$sanitize',
		function($scope, $rootScope, CatalogAPI, $sanitize)
		{
			$rootScope.breadcrumbs = [{text: 'About UNA Catalog'}];
		}
	]
).controller
(
	'TextSectionCtrl',
	[
		'$scope',
		'$rootScope',
		'$routeParams',
		'CatalogAPI',
        '$sanitize',
		function($scope, $rootScope, $routeParams, CatalogAPI, $sanitize)
		{
			CatalogAPI.getTextSection($routeParams.section, function(textSection) {
				$scope.textSection = textSection;
				$rootScope.breadcrumbs = [{text: textSection.title}];
				$scope.$apply();
			});
		}
	]
).controller
(
	'GeneralRequirementsCtrl',
	[
		'$scope',
		'$rootScope',
		'$routeParams',
		'CatalogAPI',
        '$sanitize',
		function($scope, $rootScope, $routeParams, CatalogAPI, $sanitize)
		{
			$rootScope.breadcrumbs = [{text: 'General Education Requirements'}];
			CatalogAPI.listGeneralRequirements(function(generalRequirements) {
				$scope.generalRequirements = generalRequirements;
				$scope.$apply();
			});
		}
	]
).controller
(
	'CategoryCtrl',
	[
		'$scope',
		'$rootScope',
		'$routeParams',
		'CatalogAPI',
        '$sanitize',
		function($scope, $rootScope, $routeParams, CatalogAPI, $sanitize)
		{
			CatalogAPI.getCategory($routeParams.category, function(category) {
				$rootScope.category = category;
				$rootScope.breadcrumbs = [{text: category.name}];
				$scope.$apply();
			});
		}
	]
).controller
(
	'DepartmentCtrl',
	[
		'$scope',
		'$rootScope',
		'$routeParams',
		'CatalogAPI',
        '$sanitize',
		function($scope, $rootScope, $routeParams, CatalogAPI, $sanitize)
		{
			CatalogAPI.getDepartment($routeParams.category, $routeParams.department, function(category, department) {
				$scope.category = category;
				$scope.department = department;
				$rootScope.breadcrumbs = [
					{
						text: category.name,
						url: '#/programs/category/' + category._id
					},
					{
						text: department.name
					}
				];
				$scope.$apply();
			});
		}
	]
).controller
(
	'ProgramCtrl',
	[
		'$scope',
		'$rootScope',
		'$routeParams',
		'CatalogAPI',
        '$sanitize',
		function($scope, $rootScope, $routeParams, CatalogAPI, $sanitize)
		{
			CatalogAPI.getProgram(
				$routeParams.category,
				$routeParams.department,
				$routeParams.program,
				function(category, department, program) {
					console.log(category, department, program)
					$scope.category = category;
					$scope.department = department;
					$scope.program = program;
					$rootScope.breadcrumbs = [];
					$rootScope.breadcrumbs.push({
						text: category.name,
						url: '#/programs/category/' + category._id
					});
					if(department) {
						$rootScope.breadcrumbs.push({
							text: department.name,
							url: '#/programs/category/' + category._id + '/department/' + department._id
						});
					}
					$rootScope.breadcrumbs.push({text: program.name});
					$scope.$apply();
				}
			);
		}
	]
).controller
(
	'CoursesCtrl',
	[
		'$scope',
		'$rootScope',
		'$routeParams',
		'CatalogAPI',
        '$sanitize',
		function($scope, $rootScope, $routeParams, CatalogAPI, $sanitize)
		{
			$rootScope.breadcrumbs = [{text: 'Courses'}];
			CatalogAPI.listSubjects(function(subjects) {
				$rootScope.subjects = subjects;
				$scope.$apply();
			});
		}
	]
).controller
(
	'SubjectCtrl',
	[
		'$scope',
		'$rootScope',
		'$location',
		'$routeParams',
		'CatalogAPI',
        '$sanitize',
		function($scope, $rootScope, $location, $routeParams, CatalogAPI, $sanitize)
		{
			
			/*
				Function: $scope.goToCourse
				Description: Navigate to a specified course and make it available to the $rootScope
				Input:
					course: course object
				Output:
				Created: Tyler Yasaka 04/17/2016
				Modified:
			*/
			/*$scope.goToCourse = function(course) {
				$rootScope.course = course;
				$location.path('/courses/course/' + course._id);
			}*/
			CatalogAPI.getSubject($routeParams.subject, function(subject, courses) {
				$scope.subject = subject;
				$scope.courses = courses;
				$rootScope.breadcrumbs = [
					{text: 'Courses', url: '#/courses'},
					{text: subject.name}
				];
				$scope.$apply();
			});
		}
	]
).controller
(
	'CourseCtrl',
	[
		'$scope',
		'$rootScope',
		'$routeParams',
		'CatalogAPI',
        '$sanitize',
		function($scope, $rootScope, $routeParams, CatalogAPI, $sanitize)
		{
			CatalogAPI.getCourse($routeParams.course, function(course) {
				$scope.course = course;
				$rootScope.breadcrumbs = [
					{text: 'Courses', url: '#/courses'},
					{text: course.subject.name, url: '#/courses/subject/' + course.subject._id},
					{text: course.subject.abbreviation + course.number}
				];
				$scope.$apply();
			});
		}
	]
).controller
(
	'FacultyAndStaffCtrl',
	[
		'$scope',
		'$rootScope',
		'$routeParams',
		'CatalogAPI',
        '$sanitize',
		function($scope, $rootScope, $routeParams, CatalogAPI, $sanitize)
		{
			$rootScope.breadcrumbs = [{text: 'Faculty and Staff'}];
			CatalogAPI.getFacultyAndStaff(function(facultyAndStaff) {
				$scope.facultyAndStaff = facultyAndStaff;
			});
			$scope.$apply();
		}
	]
);
