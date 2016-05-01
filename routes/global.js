/***																					***\

	Filename: global.js
	Author: Mitchel R Moon

	Copyright (c) 2015 University of North Alabama

\***																					***/

var modules =
{
	'os': require('os'),
	'express': require('express'),
	'crypto': require('crypto'),
	'mongodb': require('mongodb'),
	'fs': require('fs'),
	'multer': require('multer'),
	'xlsx': require('xlsx'),
	'async': require('async'),
	'mysql': require('mysql')
};

var globals =
{

	// Web apps supported
	webApps:
	[
		{
			id: 'catalog',
			name: 'Catalog',
			url: '/catalog'
		}
	],

	// modules
	modules: modules,

	/*--																					--*\
							GLOBAL METHODS/FUNCTIONS
	\*--																					--*/

	/*																							*\
		@name: isAuthenticated

		@parameters:
			appname: (String) app name
			privilege: (Int) access level
			session: (Object) session data
			res: (Object) response object

		@description:
			verify the user has sufficient privileges

		@return:
			(Bool) authenticated
	\*																							*/
	isAuthenticated:
		function(appname, privilege, session, res)
		{
			var login = false;
			if(session && session.apps && session.username)
			{
				var appAuthenticated = false;
				if(session.privilege == 10)
				{
					appAuthenticated = true;
				}
				else
				{
					for(var i = 0; i < session.apps.length; i++)
					{
						if(session.apps[i].id == appname)
						{
							appAuthenticated = true;
						}
					}
				}
				if(appAuthenticated && session.privilege >= privilege)
				{
					login = true;
				}
			}

			if(!login)
			{
				res.send
				(
					{
						'success': false,
						'authenticated': false
					}
				);
			}

			return login;
		},

	/*																							*\
		@name: formatDate

		@parameters:
			date: (Date) date to convert

		@description:
			converting a date to 'yyyy-mm-dd' string

		@return:
			(String) formatted date
	\*																							*/
	formatDate:
		function(date)
		{
			var d = new Date(date);

			var month = d.getMonth() + 1;
			month = (month < 10 ? '0' : '') + month.toString();
			var day = d.getDate();
			day = (day < 10 ? '0' : '') + day.toString();
			var year = d.getFullYear();

			return [year, month, day].join('-');
		},

	/*																							*\
		@name: convertToLocalTime

		@parameters:
			date: (Date) date to convert

		@description:
			convert date to local time format

		@return:
			(Date) converted date
	\*																							*/
	convertToLocalTime:
		function(date)
		{
			return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
		},

	/*																							*\
		@name: getExtension

		@parameters:
			mimetype: (String) mimetype

		@description:
			get the file extension using the mimetype

		@return:
			(String) file extension
	\*																							*/
	getExtension:
		function(mimetype)
		{
			var acceptedImageTypes =
			[
				{
					'type': 'image/jpeg',
					'extension': '.jpg'
				},
				{
					'type': 'image/png',
					'extension': '.png'
				},
				{
					'type': 'application/msword',
					'extension': '.doc'
				},
				{
					'type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
					'extension': '.docx'
				},
				{
					'type': 'application/vnd.ms-excel',
					'extension': '.xls'
				},
				{
					'type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
					'extension': '.xlsx'
				}
			];

			var extension = '';

			for(var i in acceptedImageTypes)
			{
				if(mimetype == acceptedImageTypes[i].type)
				{
					extension = acceptedImageTypes[i].extension;
				}
			}

			return extension;
		}

};

// get host information
var hostname = modules['os'].hostname();
var mysqlOpts = {};

mysqlOpts =
{
	host: '',
	user: '',
	password: '',
	database: '',
	port: 3306,
	insecureAuth: true
};

/*																							*\
	@name: connectMysql

	@parameters:

	@description:
		create connection to mysql database

	@return:
		(Object) mysql connection
\*																							*/
globals.connectMysql =
	function()
	{
		var connection = modules['mysql'].createConnection(mysqlOpts);
		connection.connect();

		return connection;
	};

module.exports = globals;
