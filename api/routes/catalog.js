/***																					***\

	Filename: api/routes/catalog.js
	Author: Tyler Yasaka

\***																					***/

// housekeeping
var globals = require('./global');
var modules = globals.modules;
var db = require('../models/catalog.model');
var isAuthenticated = globals.isAuthenticated;
var router = modules.express.Router();
var appname = 'catalog';
var privilege = {
	primaryAdmin: 5,
	secondaryAdmin: 2
}

// connect to mongoose
db.mongoose.connect('mongodb://cyan:8029df8b@ds035603.mongolab.com:35603/apps');
var connection = db.mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function() {
	console.log('connected to mongodb');
});

/*--																					--*\
								SAMPLE ROUTES 							
\*--																					--*/

// A simple GET request
router.get
(
	'/helloworld',
	function(req, res)
	{
		res.send('Hello world');
	}
);

// A GET request with a parameter
router.get
(
	'/helloworld/:name',
	function(req, res)
	{
		res.send('Hello world, and ' + req.params.name);
	}
);

// A POST request with JSON data
// The data sent could look like: {"firstName": "Tyler", "lastName": "Awesome"}
router.post
(
	'/helloworld',
	function(req, res)
	{
		res.send('Hello world, and ' + req.body.firstName + ' ' + req.body.lastName);
	}
);


/*--																					--*\
						PRIMARY ADMIN API ROUTES 							
\*--																					--*/

router.post
(
	'/admin/catalog/textSections',
	function(req, res)
	{
		// restrict this to primary admins
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			new db.models.TextSection(req.body).save(function(err){
				var success = err ? false : true;
				res.send({success: success});
			});
		}
	}
);

router.put
(
	'/admin/catalog/textSections/:id',
	function(req, res)
	{
		// restrict this to primary admins
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.TextSection.update(
				{ _id: req.params.id },
				{ $set: req.body}
			).exec(
				function(err){
					var success = err ? false : true;
					res.send({success: success});
				}
			);
		}
	}
);

router.delete
(
	'/admin/catalog/textSections/:id',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.TextSection.remove({_id: req.params.id}).exec(function(err){
				var success = err ? false : true;
				res.send({success: success});
			});
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
		db.models.TextSection.find().select('title').exec( function(err, results) {
			var success = err ? false : true;
			res.send({
				success: success,
				data: results
			});
		});
	}
);

router.get
(
	'/catalog/textSections/:id',
	function(req, res)
	{
		db.models.TextSection.findById(req.params.id).exec(function(err, results) {
			var success = err ? false : true;
			res.send({
				success: success,
				data: results
			});
		});
	}
);

router.get
(
	'/catalog/programs',
	function(req, res)
	{
		db.models.Program.find().select('name description').exec( function(err, results) {
			var success = err ? false : true;
			res.send({
				success: success,
				data: results
			});
		});
	}
);


// export these routes to the main router
module.exports = router;
