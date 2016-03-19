/***																					***\

	Filename: routes/catalog.js
	Author: Tyler Yasaka

	Copyright (c) 2015 University of North Alabama

\***																					***/

var globals = require('./global');
var modules = globals.modules;
var db = require('../models/catalog');
var isAuthenticated = globals.isAuthenticated;

// connect to mongoose
db.mongoose.connect('mongodb://cyan:8029df8b@ds035603.mongolab.com:35603/apps');
var connection = db.mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function() {
	console.log('connected to mongodb');
});

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
	'/catalog/textSections',
	function(req, res)
	{
		db.models.TextSection.find( function(err, results) {
			res.send(results);
		});
	}
);

// export these routes to the main router
module.exports = router;
