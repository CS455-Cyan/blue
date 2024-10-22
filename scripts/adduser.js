//Run this script to add a primary admin to the Mongo database

var username = 'username';
var password = 'Password1';

//1 for ordinary users; 10 for "super users" (super users can automatically access all apps)
var privilege = 5;

//for non-super users, explicit permission must be given to use each app. list app name here (refer to above apps list)
//example: ['calendar','cobalumni']
var apps = ['catalog'];

/*
	----------------------------------------------------------------------------
*/

var crypto = require('crypto');
var mongodb = require('mongodb');

password = crypto.createHash('md5').update(password).digest('hex');

var mongoClient = mongodb.MongoClient;
var db = {};

mongoClient.connect
(
  'mongodb://cyan:8029df8b@ds035603.mongolab.com:35603/apps',
  function(err, database)
  {
    if(!err)
    {
      db.admin = database.collection('admins');
			db.admin.insert
			(
				{
					'username': username,
					'password': password,
					'privilege': privilege,
					'apps': apps
				},
				function(err, records)
				{
					console.log('User added successfully.');
				}
			);
    }
  }
);