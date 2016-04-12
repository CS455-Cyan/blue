/***																					***\

	Filename: api/routes/catalog.js
	Author: Tyler Yasaka
			Andrew Fisher

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

/*
 * Route: Add textSection
 * 
 * Input
 *   payload: {"title": String, "content": String}
 * Output
 *   {"success": Boolean}
 */
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

/*
 * Route: Update textSection
 * 
 * Input
 *   url parameters:
 *     id: id of textSection
 *   payload: {"title": String, "content": String}
 * Output
 *   {"success": Boolean}
 */
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

/*
 * Route: Remove textSection
 * 
 * Input
 *   url parameters:
 *     id: id of textSection
 * Output
 *   {"success": Boolean}
 */
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

/*
 * Route: Add department
 * 
 * Input
 *   url parameters:
 *     category: id of category to add department to
 *   payload: {"name": String, "description": String, programs: []}
 * Output
 *   {"success": Boolean}
 */
router.post
(
	'/admin/catalog/departments/:category',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.Program.findOne(function(err, programs){
				var category = programs.categories.id(req.params.category);
				if(category) {
					category.departments.push(req.body);
				}
				programs.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			});
		}
	}
);

/*
 * Route: Update department
 * 
 * Input
 *   url parameters:
 *     category: id of category that department is in
 *     department: id of department
 *   payload: {"name": String, "description": String, programs: []}
 * Output
 *   {"success": Boolean}
 */
router.put
(
	'/admin/catalog/departments/:category/:department',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.Program.findOne(function(err, programs){
				var category = programs.categories.id(req.params.category);
				if(category) {
					var department = category.departments.id(req.params.department);
					if(department) {
						for(var attribute in req.body) {
							department[attribute] = req.body[attribute];
						}
					}
				}
				programs.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			});
		}
	}
);

/*
 * Route: Remove department
 * 
 * Input
 *   url parameters:
 *     category: id of category that department is in
 *     department: id of department
 * Output
 *   {"success": Boolean}
 */
router.delete
(
	'/admin/catalog/departments/:category/:department',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.Program.findOne(function(err, programs){
				var category = programs.categories.id(req.params.category);
				if(category) {
					var department = category.departments.id(req.params.department);
					if(department) {
						department.remove();
					}
				}
				programs.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			});
		}
	}
);

/*
 * Route: Add program to category
 * 
 * Input
 *   url parameters:
 *     category: id of category to add program to
 *   payload: {"type": String, "name": String, "description": String, requirements: []}
 * Output
 *   {"success": Boolean}
 */
router.post
(
	'/admin/catalog/programs/:category',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.Program.findOne(function(err, programs){
				var category = programs.categories.id(req.params.category);
				if(category) {
					category.programs.push(req.body);
				}
				programs.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			});
		}
	}
);

/*
 * Route: Add program to department
 * 
 * Input
 *   url parameters:
 *     category: id of category containing department
 *     department: id of department to add program to
 *   payload: {"type": String, "name": String, "description": String, requirements: []}
 * Output
 *   {"success": Boolean}
 */
router.post
(
	'/admin/catalog/programs/:category/:department',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.Program.findOne(function(err, programs){
				var category = programs.categories.id(req.params.category);
				if(category) {
					var department = category.departments.id(req.params.department);
					if(department){
						department.programs.push(req.body);
					}
				}
				programs.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			});
		}
	}
);

/*
 * Route: Update program in category
 * 
 * Input
 *   url parameters:
 *     category: id of category containing program
 *     program: id of program
 *   payload: {"type": String, "name": String, "description": String, requirements: []}
 * Output
 *   {"success": Boolean}
 */
router.put
(
	'/admin/catalog/programs/:category/:program',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.Program.findOne(function(err, programs){
				var category = programs.categories.id(req.params.category);
				if(category) {
					var program = category.programs.id(req.params.program);
					if(program) {
						for(var attribute in req.body) {
							program[attribute] = req.body[attribute];
						}
					}
				}
				programs.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			});
		}
	}
);

/*
 * Route: Update program in department
 * 
 * Input
 *   url parameters:
 *     category: id of category containing department
 *     department: id of department containing program
 *     program: id of program
 *   payload: {"type": String, "name": String, "description": String, requirements: []}
 * Output
 *   {"success": Boolean}
 */
router.put
(
	'/admin/catalog/programs/:category/:department/:program',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.Program.findOne(function(err, programs){
				var category = programs.categories.id(req.params.category);
				if(category) {
					var department = category.departments.id(req.params.department);
					if(department) {
						var program = department.programs.id(req.params.program);
						if(program) {
							for(var attribute in req.body) {
								program[attribute] = req.body[attribute];
							}
						}
					}
				}
				programs.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			});
		}
	}
);

/*
 * Route: Remove program from category
 * 
 * Input
 *   url parameters:
 *     category: id of category containing program
 *     program: id of program
 * Output
 *   {"success": Boolean}
 */
router.delete
(
	'/admin/catalog/programs/:category/:program',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.Program.findOne(function(err, programs){
				var category = programs.categories.id(req.params.category);
				if(category) {
					var program = category.programs.id(req.params.program);
					if(program) {
						program.remove();
					}
				}
				programs.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			});
		}
	}
);

/*
 * Route: Remvoe program from department
 * 
 * Input
 *   url parameters:
 *     category: id of category containing department
 *     department: id of department containing program
 *     program: id of program
 * Output
 *   {"success": Boolean}
 */
router.delete
(
	'/admin/catalog/programs/:category/:department/:program',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.Program.findOne(function(err, programs){
				var category = programs.categories.id(req.params.category);
				if(category) {
					var department = category.departments.id(req.params.department);
					if(department) {
						var program = department.programs.id(req.params.program);
						if(program) {
							program.remove();
						}
					}
				}
				programs.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			});
		}
	}
);

/*
 * Route: Update facultyAndStaff
 * 
 * Input
 *   payload: {"content": String}
 * Output
 *   {"success": Boolean}
 */
router.put
(
	'/admin/catalog/facultyAndStaff',
	function(req, res)
	{
		// restrict this to primary admins
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.FacultyAndStaff.update(
				{},
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

/*--																					--*\
								PUBLIC API ROUTES 							
\*--																					--*/

/*
 * Route: List textSections
 * 
 * Input
 * Output
 *   {"success": Boolean, data: ["_id": String, "title": String]}
 */
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

/*
 * Route: Get textSection
 * 
 * Input
 *   url parameters:
 *     id: id of textSection
 * Output
 *   {"success": Boolean, data: {"_id": String, "title": String, "content": String}}
 */
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

/*
 * Route: List generalRequirements
 * 
 * Input
 * Output
 *   {"success": Boolean, data: {
 *     "AreaI": {"_id": String, "name": String, "requirements": []},
 *     "AreaII": {"_id": String, "name": String, "requirements": []},
 *     "AreaIII": {"_id": String, "name": String, "requirements": []},
 *     "AreaIV": {"_id": String, "name": String, "requirements": []},
 *     "AreaV": {"_id": String, "name": String, "requirements": []},
 *   }}
 */
router.get
(
	'/catalog/generalRequirements',
	function(req, res)
	{
		db.models.GeneralRequirement.find().select().exec( function(err, results) {
			var success = err ? false : true;
			res.send({
				success: success,
				data: results.sort()
			});
		});
	}
);

/*
 * Route: List programs
 * 
 * Input
 * Output
 *   {"success": Boolean, data: {
 *     "categories": [{
 *       "_id": String,
 *       "name": String,
 *       "description": String,
 *       "programs": [],
 *       "departments": [{
 *         "_id": String,
 *         "name": String,
 *         "description: String,
 *         "programs": []
 *       }]
 *     }]
 *   }}
 */
router.get
(
	'/catalog/programs',
	function(req, res)
	{
		db.models.Program.find().select('categories').exec( function(err, results) {
			var success = err ? false : true;
			res.send({
				success: success,
				data: results
			});
		});
	}
);

/*
 * Route: List courses
 * 
 * Input
 * Output
 *   {"success": Boolean, data: {
 *     "subjects": [
 *       "_id": String,
 *       "name": String,
 *       "abbreviation": String,
 *       "courses": []
 *     ]
 *   }}
 */
router.get
(
	'/catalog/courses',
	function(req, res)
	{
		db.models.Course.find().select('subjects').exec( function(err, results) {
			var success = err ? false : true;
			res.send({
				success: success,
				data: results
			});
		});
	}
);

/*
 * Route: Get facultyAndStaff
 * 
 * Input
 *   url parameters:
 *     id: id of textSection
 * Output
 *   {"success": Boolean, data:  String}
 */
router.get
(
	'/catalog/facultyAndStaff',
	function(req, res)
	{
		db.models.FacultyAndStaff.findOne().exec(function(err, result) {
			var success = err ? false : true;
			res.send({
				success: success,
				data: result.content
			});
		});
	}
);


// export these routes to the main router
module.exports = router;
