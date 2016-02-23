/***																					***\

	Filename: catalog.js
	Author: Tyler Yasaka

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
			db.sampleCollection = database.collection('sampleCollection');
		}
	}
);

var router = modules.express.Router();

/*--																					--*\
								ADMIN API ROUTES 							
\*--																					--*/

router.post
(
	'/admin/catalog/sample',
	function(req, res)
	{
		var appname = 'catalog';
		var privilege = 5;//keep this off-limits for lower-level users
		if(isAuthenticated(appname, privilege, req.session, res))
		{
			req.body.timestamp = globals.convertToLocalTime(new Date());
			db.sampleCollection.insert
			(
				req.body,
				function(err, records)
				{
					var success = false;
					if(!err){
						success = true;
					}
					res.send({'success':success});
				}
			);
		}
	}
);

router.put
(
	'/admin/catalog/sample/:id',
	function(req, res)
	{
		var appname = 'homepage';
		var privilege = 1;
		if(isAuthenticated(appname, privilege, req.session, res))
		{
			res.send({id: req.params.id});
		}
	}
);

router.delete
(
	'/admin/catalog/sample/:id',
	function(req, res)
	{
		var appname = 'homepage';
		var privilege = 1;
		if(isAuthenticated(appname, privilege, req.session, res))
		{
			res.send({check: "123"});
		}
	}
);

router.get
(
	'/admin/catalog/sample',
	function(req, res)
	{
		var appname = 'homepage';
		var privilege = 1;
		if(isAuthenticated(appname, privilege, req.session, res))
		{
			res.send({check: "123"});
		}
	}
);

/*--																					--*\
								PUBLIC API ROUTES 							
\*--																					--*/

router.get
(
	'/catalog/sample',
	function(req, res)
	{
		res.send({check: "123"});
	}
);

module.exports = router;
