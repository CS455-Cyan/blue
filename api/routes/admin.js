/***																					***\

	Filename: admin.js
	Author: Mitchel R Moon

	Copyright (c) 2015 University of North Alabama

\***																					***/

var globals = require('./global');
var modules = globals.modules;
var isAuthenticated = globals.isAuthenticated;

// connect to collection
var mongoClient = modules.mongodb.MongoClient;
var ObjectId = modules.mongodb.ObjectID;

// connect to mongoose
modules.mongoose.connect('mongodb://cyan:8029df8b@ds035603.mongolab.com:35603/apps');
var connection = modules.mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function() {
	console.log('connected successfully');
});

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

router.get('/admin/mongoose', function(req, res){
	console.log('asdf');
connection.once('open', function() {
        console.log('connected successfully');
});
var kittySchema = modules.mongoose.Schema({
    name: String
});
var Kitten = modules.mongoose.model('Kitten', kittySchema);
var silence = new Kitten({ name: 'Silence' });
console.log(silence.name); // 'Silence'
silence.save(function(err, silence) {
	console.log('saved');
});

	res.send({});
});

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
		password = modules['crypto'].createHash('md5').update(password).digest('hex');

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

					if(records.length > 0)
					{
						var privilege = records[0].privilege;
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

						success = true;
					}

					res.send
					(
						{
							'success': success,
							'apps': apps
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
					'apps': req.session.apps
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

module.exports = router;
