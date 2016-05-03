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
						'/curriculum-change-request',
						{
							templateUrl: 'views/catalog-request/index.html',
							controller: 'CatalogRequest-HomeCtrl'
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
