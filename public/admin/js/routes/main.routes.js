/***																					***\

	Filename: routes.js
	Author: Tyler Yasaka, Mitchel R Moon

	Copyright (c) 2015 University of North Alabama
	
\***																					***/

(
	function(angular)
	{
		'use strict';

		/* Routes */

		angular.module('AppAdmin')
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
						'/login',
						{
							templateUrl: 'views/login.html',
							controller: 'LoginCtrl'
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
