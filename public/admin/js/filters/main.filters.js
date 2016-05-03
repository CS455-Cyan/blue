/***																					***\

	Filename: main.filters.js
	Author: Mitchel R Moon

	Copyright (c) 2015 University of North Alabama
	
\***																					***/

(
	function(angular)
	{
		'use strict';

		angular.module('AppAdmin')
		.filter
		(
			'phoneNumber',
			function()
			{
				var fnPhoneFilter =
					function(input)
					{
						var phoneNum;

						if(!input)
						{
							phoneNum = '';
						}
						else
						{
							var phoneNum = input.toString();

							phoneNum = phoneNum.replace('(', '').replace('(', '').replace(' ', '').replace('-', '').replace('.', '');

							switch(phoneNum.length)
							{
								case 7:
									phoneNum = '256' + phoneNum;
									break;
								case 10:
									phoneNum = phoneNum;
									break;
								default:
									phoneNum = '';
									break;
							}

							if(phoneNum.length == 10)
							{
								phoneNum = phoneNum.substr(0, 3) + '.' + phoneNum.substr(3, 3) + '.' + phoneNum.substr(6, 4);
							}
						}

						return phoneNum;
					};

				return fnPhoneFilter;
			}
		).filter
		(
			'prettyDate',
			function()
			{
				var fnDateFilter =
					function(input)
					{
						var date = new Date(input);
						date = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));

						var month = date.getMonth() + 1;
						var day = date.getDate();
						var year = date.getFullYear();

						month = (month < 10 ? '0' : '') + month.toString();
						day = (day < 10 ? '0' : '') + day.toString();

						var filtered = month + '/' + day + '/' + year;

						return filtered;
					};

				return fnDateFilter;
			}
		).filter
		(
			'currency',
			function()
			{
				var fnCurrencyFilter =
					function(input)
					{
						var cash = '$' + input.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1");

						return cash;
					};

				return fnCurrencyFilter;
			}
		);

	}
)
(
	angular
);
