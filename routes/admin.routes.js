/***																					***\

	Filename: admin.js
	Author: Mitchel R Moon
	Modified By:	Andrew Fisher
					John Batson

	Copyright (c) 2015 University of North Alabama

\***																					***/

var globals = require('./global');
var modules = globals.modules;
var isAuthenticated = globals.isAuthenticated;

// connect to collection
var mongoClient = modules.mongodb.MongoClient;
var ObjectId = modules.mongodb.ObjectID;

var db = {};

mongoClient.connect
(
	'mongodb://cyan:8029df8b@ds035603.mongolab.com:35603/apps',
	function(err, database)
	{
		if(!err)
		{
			db.admins = database.collection('admins');
		}
	}
);

var router = modules.express.Router();

/*--																					--*\
								PUBLIC API ROUTES
\*--																					--*/

router.post
(
	'/admin/login',
	function(req, res)
	{
		var success = false;
		var username = req.body.username;
		var password = req.body.password;
		password = modules['crypto'].createHash('md5').update(password).digest('hex');;

		var currentTime = Date.now();
		var allowed = loginAttempt(req, res, currentTime);

		if(db.admins)
		{
			db.admins.find
			(
				{
					'username': {$eq: username},
					'password': {$eq: password}
				}
			).toArray
			(
				function(err, records)
				{
					var apps = [];

					if(records.length > 0 && allowed)
					{
						var privilege = records[0].privilege;
						var id = records[0]._id;
						var apps = [];

						if(privilege >= 10)
						{
							apps = globals.webApps;
						}
						else
						{
							for(var i in globals.webApps)
							{
								for(var j in records[0].apps)
								{
									if(globals.webApps[i].id == records[0].apps)
									{
										apps.push(globals.webApps[i]);
									}
								}
							}
						}

						req.session.username = username;
						req.session.privilege = privilege;
						req.session.apps = apps;
						req.session._id = id;
						req.session.attempts = 0;
						req.session.lastTime = Date.now()

						success = true;
					}

					res.send
					(
						{
							'success': success,
							'apps': apps,
							'privilege': privilege,
							'username': username,
							'_id': id
						}
					);
				}
			);
		}
	}
);

router.get
(
	'/admin/logout',
	function(req, res)
	{
		req.session.destroy
		(
			function(err)
			{
				if(err)
				{
					console.log(err);
				}
				else
				{
					res.send
					(
						{
							'success': true
						}
					);
				}
			}
		);
	}
);

router.get
(
	'/admin/session',
	function(req, res)
	{
		if(req.session.username)
		{
			res.send
			(
				{
					'authenticated': true,
					'apps': req.session.apps,
					'privilege': req.session.privilege,
					'username': req.session.username,
					'_id': req.session._id
				}
			);
		}
		else
		{
			res.send
			(
				{
					'authenticated': false
				}
			);
		}
	}
);

/*	Limits Login Attempts
	Authors: 05/02/2016 Andrew Fisher
			 05/02/2016 John Batson
*/
function loginAttempt(req, res, current)
{
	var allowed = false;

	if(!req.session.attempts)
	{
		req.session.attempts = 0;
	}

	if(req.session.attempts < 3)
	{
		req.session.attempts += 1;
		req.session.lastTime = Date.now();
		allowed = true;
	}
	else if(++req.session.attempts >= 3 && (current - req.session.lastTime) > 60000)
	{
		req.session.lastTime = Date.now();
		allowed = true;
	}

	return allowed;
};

module.exports = router;
