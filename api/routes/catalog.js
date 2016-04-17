/***																					***\

	Filename: api/routes/catalog.js
	Authors:
			Tyler Yasaka
			Andrew Fisher
			Kaitlin Snyder
			John Batson

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
								PUBLIC API ROUTES 							
\*--																					--*/

/*
 * Route: List textSections
 * 
 * Created: 03/24/2016 Tyler Yasaka
 * 
 * Modified:
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
		db.models.TextSection.findOne().select('sections.title sections._id').exec( function(err, results) {
			var success = err ? false : true;
			res.send({
				success: success,
				data: results.sections
			});
		});
	}
);

/*
 * Route: Get textSection
 * 
 * Created: 03/24/2016 Tyler Yasaka
 * 
 * Modified:
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
		db.models.TextSection.findOne().exec(function(err, results) {
			var section = results.sections.id(req.params.id);
			var success = err || !section ? false : true;
			res.send({
				success: success,
				data: section
			});
		});
	}
);

/*
 * Route: List generalRequirements
 * 
 * Created: 04/02/2016 Andrew Fisher
 * 
 * Modified:
 *   04/17/2016 Tyler Yasaka
 * 
 * Input
 * Output
 *   {"success": Boolean, data: [
 *     {"_id": String, "area": String, name": String, "requirements": []},
 *     {"_id": String, "area": String, "name": String, "requirements": []},
 *     {"_id": String, "area": String, "name": String, "requirements": []},
 *     {"_id": String, "area": String, "name": String, "requirements": []},
 *     {"_id": String, "area": String, "name": String, "requirements": []},
 *   ]}
 */
router.get
(
	'/catalog/generalRequirements',
	function(req, res)
	{
		db.models.GeneralRequirement.find()
		.populate({
			path: 'requirements.items.courses',
			populate: {
				path: 'subject'
			}
		}).exec( function(err, results) {
			var success = err ? false : true;
			res.send({
				success: success,
				data: results
			});
		});
	}
);

/*
 * Route: List program categories
 * 
 * Created: 04/02/2016 Andrew Fisher
 * 
 * Modified:
 *   04/08/2016 Tyler Yasaka
 *   04/17/2016 Tyler Yasaka
 * 
 * Input
 * Output
 *   {"success": Boolean, data: [
 *     {
 *       "_id": String,
 *       "name": String,
 *     }
 *   ]}
 */
router.get
(
	'/catalog/programCategories',
	function(req, res)
	{
		db.models.Program.find().select('name').exec( function(err, results) {
			var success = err ? false : true;
			res.send({
				success: success,
				data: results
			});
		});
	}
);

/*
 * Route: View category details
 * 
 * Created: 04/02/2016 Andrew Fisher
 * 
 * Modified:
 *   04/08/2016 Tyler Yasaka
 *   04/17/2016 Tyler Yasaka
 * 
 * Input
 * Output
 *   {"success": Boolean, data: [
 *     {
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
 *     }
 *   ]}
 */
router.get
(
	'/catalog/programCategories/:id',
	function(req, res)
	{
		db.models.Program.find({_id: req.params.id})
		.populate({
			path: 'departments.programs.requirements.items.courses',
			populate: {
				path: 'subject'
			}
		}).populate({
			path: 'programs.requirements.items.courses',
			populate: {
				path: 'subject'
			}
		}).exec( function(err, results) {
			var success = err ? false : true;
			res.send({
				success: success,
				data: results
			});
		});
	}
);

router.post
(
	'/catalog/programs/search/',
	function(req, res)
	{
		db.models.Program.findOne(function(err, programs) {
			for(var c in programs.categories){
				for(var p in programs.categories[c].programs){
					var progName = programs.categories[c].programs[p].name.toLowerCase().indexOf(req.body.term.toLowerCase());
					console.log(progName);
					var progDesc = programs.categories[c].programs[p].description.toLowerCase().indexOf(req.body.term.toLowerCase());
					console.log(progDesc);
					}
				for(var d in programs.categories[c].departments){
					var deptName = programs.categories[c].departments[d].name.toLowerCase().indexOf(req.body.term.toLowerCase());
					console.log(deptName);
					var deptDesc = programs.categories[c].departments[d].description.toLowerCase().indexOf(req.body.term.toLowerCase());
					console.log(deptDesc);
				}
			}
			var programsArr = [];
			if(progName == 0 || progDesc == 0 || deptName == 0 || deptDesc ==0){
				programsArr.push(programs);
			}
				var success = err ? false : true;
				res.send({success: success, data: programsArr});
		});
	}
);

/*
 * Route: List courses
 * 
 * Created: 04/02/2016 Andrew Fisher
 * 
 * Modified:
 *   04/08/2016 Tyler Yasaka
 *   04/17/2016 Tyler Yasaka
 * 
 * Input
 * Output
 *   {"success": Boolean, data: [
 *     "_id": String,
 *     "title": String
 *     "number": String,
 *     "description": String,
 *     "offerings": []
 *     "subject": {
 *       "_id": String,
 *       "name": String,
 *       "abbreviation": String
 *     }
 *   ]}
 */
router.get
(
	'/catalog/courses',
	function(req, res)
	{
		db.models.Course.find().populate('subject').exec( function(err, results) {
			var success = err ? false : true;
			res.send({
				success: success,
				data: results
			});
		});
	}
);

router.post
(
	'/catalog/courses/search/',
	function(req, res)
	{
		db.models.Course.findOne(function(err, courses) {
			for(var s in courses.subjects){
				var courseName = courses.subjects[s].name.toLowerCase().indexOf(req.body.term.toLowerCase());
				console.log(courseName);
				for(var c in courses.subjects[s].courses){
					var className = courses.subjects[s].courses[c].title.toLowerCase().indexOf(req.body.term.toLowerCase());
					console.log(className);
				}
			}
			var courseArr = [];
			if(courseName == 0 || className == 0){
				courseArr.push(courses);
			}
			var success = err ? false : true;
			res.send({success: success, data: courseArr});
		});
	}
);

/*
 * Route: Get facultyAndStaff
  * 
 * Created: 04/11/2016 Tyler Yasaka
 * 
 * Modified:
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

/*--																					--*\
						PRIMARY ADMIN API ROUTES 							
\*--																					--*/

/*
 * Route: Add textSection
 * 
 * Created: 03/24/2016 Tyler Yasaka
 * 
 * Modified:
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
			db.models.TextSection.findOne(function(err, textSections){
				textSections.sections.push(req.body);
				textSections.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			});
		}
	}
);

/*
 * Route: Update all textSections (use to re-order them)
 * 
 * Created: 04/14/2016 Tyler Yasaka
 * 
 * Modified:
 * 
 * Input
 *   payload: [{"title": String, "content": String}, {"title": String, "content": String}]
 * Output
 *   {"success": Boolean}
 */
router.put
(
	'/admin/catalog/textSections',
	function(req, res)
	{
		// restrict this to primary admins
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.TextSection.findOne(function(err, textSections){
				textSections.sections = [];
				if(req.body.length) {
					for(var i in req.body) {
						textSections.sections.push(req.body[i]);
					}
				}
				textSections.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			});
		}
	}
);

/*
 * Route: Update textSection
 * 
 * Created: 03/24/2016 Tyler Yasaka
 * 
 * Modified:
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
			db.models.TextSection.findOne(function(err, textSections){
				var section = textSections.sections.id(req.params.id);
				if(section) {
					for(var attribute in req.body) {
						section[attribute] = req.body[attribute];
					}
				}
				textSections.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			});
		}
	}
);

/*
 * Route: Remove textSection
 * 
 * Created: 03/24/2016 Tyler Yasaka
 * 
 * Modified:
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
			db.models.TextSection.findOne(function(err, textSections){
				var section = textSections.sections.id(req.params.id);
				if(section) {
					section.remove();
				}
				textSections.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			});
		}
	}
);

/*
 * Route: Add requirement to area
 * 
 * Created: 04/16/2016 John Batson
 * 
 * Modified:
 *   04/17/2016 Tyler Yasaka
 * 
 * Input
 *   url parameters:
 *     area: id of area to add program to
 *   payload: {"name": String, "items": []}
 * Output
 *   {"success": Boolean}
 */
router.post
(
	'/admin/catalog/generalRequirements/:area',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.GeneralRequirement.findOne({area: req.params.area}).exec(function(err, area){
				if(area) {
					if(area.requirements) {
						area.requirements.push(req.body);
					}
					area.save(function(err){
						var success = err ? false : true;
						res.send({success: success});
					});
				}
				else {
					res.send({success: false, error: 'Area does not exist'});
				}
			});
		}
	}
);

/*
 * Route: Update requirement in area
 * 
 * Created: 04/16/2016 John Batson
 * 
 * Modified:
 *   04/17/2016 Tyler Yasaka
 * 
 * Input
 *   url parameters:
 *     area: id of area containing requirement
 *     requirement: id of requirement
 *   payload: {"name": String, "items": []}
 * Output
 *   {"success": Boolean}
 */
router.put
(
	'/admin/catalog/generalRequirements/:area/:requirement',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.GeneralRequirement.findOne({area: req.params.area}).exec(function(err, area){
				if(area) {
					if(area.requirements) {
						var requirement = area.requirements.id(req.params.requirement);
						if(requirement) {
							for(var attribute in req.body) {
								requirement[attribute] = req.body[attribute];
							}
						}
					}
					area.save(function(err){
						var success = err ? false : true;
						res.send({success: success});
					});
				}
				else {
					res.send({success: false, error: 'Area does not exist'});
				}
			});
		}
	}
);

/*
 * Route: Remove requirement from area
 * 
 * Created: 04/16/2016 John Batson
 * 
 * Modified:
 *   04/17/2016 Tyler Yasaka
 * 
 * Input
 *   url parameters:
 *     area: id of area containing requirement
 *     requirement: id of requirement
 * Output
 *   {"success": Boolean}
 */
router.delete
(
	'/admin/catalog/generalRequirements/:area/:requirement',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.GeneralRequirement.findOne({area: req.params.area}).exec(function(err, area){
				if(area) {
					if(area.requirements) {
						var requirement = area.requirements.id(req.params.requirement);
						if(requirement) {
							requirement.remove();
						}
					}
					area.save(function(err){
						var success = err ? false : true;
						res.send({success: success});
					});
				}
				else {
					res.send({success: false, error: 'Area does not exist'});
				}
			});
		}
	}
);

/*
 * Route: Add category
 * 
 * Created: 04/15/2016 Kaitlin Snyder
 * 
 * Modified:
 *   04/17/2016 Tyler Yasaka
 * 
 * Input
 *   payload: {"name": String, "description": String, "departments": [], "programs": []}
 * Output
 *   {"success": Boolean}
 */
router.post
(
	'/admin/catalog/programCategories',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.Program(req.body).save(function(err){
				var success = err ? false : true;
				res.send({success: success});
			});
		}
	}
);

/*
 * Route: Update category
 * 
 * Created: 04/15/2016 Kaitlin Snyder
 * 
 * Modified:
 *   04/17/2016 Tyler Yasaka
 * 
 * Input
 *   url parameters:
 *     id: id of category to update
 *   payload: {"name": String, "description": String, "departments": [], "programs": []}
 * Output
 *   {"success": Boolean}
 */
router.put
(
	'/admin/catalog/programCategories/:id',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.Program.findOne({_id: req.params.id}).exec(function(err, category){
				if(category) {
					for(var attribute in req.body) {
						category[attribute] = req.body[attribute];
					}
					category.save(function(err){
						var success = err ? false : true;
						res.send({success: success});
					});
				}
				else {
					res.send({success: false, error: 'Category does not exist'});
				}
			});
		}
	}
);

/*
 * Route: Remove category
 * 
 * Created: 04/15/2016 Kaitlin Snyder
 * 
 * Modified:
 *   04/17/2016 Tyler Yasaka
 * 
 * Input
 *   url parameters:
 *     id: id of category to update
 * Output
 *   {"success": Boolean}
 */
router.delete
(
	'/admin/catalog/programCategories/:id',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.Program.findOne({_id: req.params.id}).exec(function(err, category){
				if(category) {
					category.remove(function(err){
						var success = err ? false : true;
						res.send({success: success});
					});
				}
				else {
					res.send({success: false, error: 'Category does not exist'});
				}
			});
		}
	}
);



/*
 * Route: Add department
 * 
 * Created: 04/9/2016 Tyler Yasaka
 * 
 * Modified:
 *   04/17/2016 Tyler Yasaka
 * 
 * Input
 *   url parameters:
 *     category: id of category to add department to
 *   payload: {"name": String, "description": String, "programs": []}
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
			db.models.Program.findOne({_id: req.params.category}).exec(function(err, category){
				if(category) {
					category.departments.push(req.body);
					category.save(function(err){
						var success = err ? false : true;
						res.send({success: success});
					});
				}
				else {
					res.send({success: false, error: 'Category does not exist'});
				}
			});
		}
	}
);

/*
 * Route: Update department
 * 
 * Created: 04/9/2016 Tyler Yasaka
 * 
 * Modified:
 *   04/17/2016 Tyler Yasaka
 * 
 * Input
 *   url parameters:
 *     category: id of category that department is in
 *     department: id of department
 *   payload: {"name": String, "description": String, "programs": []}
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
			db.models.Program.findOne({_id: req.params.category}).exec(function(err, category){
				if(category) {
					var department = category.departments.id(req.params.department);
					if(department) {
						for(var attribute in req.body) {
							department[attribute] = req.body[attribute];
						}
					}
					category.save(function(err){
						var success = err ? false : true;
						res.send({success: success});
					});
				}
				else {
					res.send({success: false, error: 'Category does not exist'});
				}
			});
		}
	}
);

/*
 * Route: Remove department
 * 
 * Created: 04/9/2016 Tyler Yasaka
 * 
 * Modified:
 *   04/17/2016 Tyler Yasaka
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
			db.models.Program.findOne({_id: req.params.category}).exec(function(err, category){
				if(category) {
					var department = category.departments.id(req.params.department);
					if(department) {
						department.remove();
					}
					category.save(function(err){
						var success = err ? false : true;
						res.send({success: success});
					});
				}
				else {
					res.send({success: false, error: 'Category does not exist'});
				}
			});
		}
	}
);

/*
 * Route: Add program to category
 * 
 * Created: 04/11/2016 Tyler Yasaka
 * 
 * Modified:
 *   04/17/2016 Tyler Yasaka
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
			db.models.Program.findOne({_id: req.params.category}).exec(function(err, category){
				if(category) {
					category.programs.push(req.body);
					category.save(function(err){
						var success = err ? false : true;
						res.send({success: success});
					});
				}
				else {
					res.send({success: false, error: 'Category does not exist'});
				}
			});
		}
	}
);

/*
 * Route: Add program to department
 * 
 * Created: 04/11/2016 Tyler Yasaka
 * 
 * Modified:
 *   04/17/2016 Tyler Yasaka
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
			db.models.Program.findOne({_id: req.params.category}).exec(function(err, category){
				if(category) {
					var department = category.departments.id(req.params.department);
					if(department){
						department.programs.push(req.body);
					}
					category.save(function(err){
						var success = err ? false : true;
						res.send({success: success});
					});
				}
				else {
					res.send({success: false, error: 'Category does not exist'});
				}
			});
		}
	}
);

/*
 * Route: Update program in category
 * 
 * Created: 04/11/2016 Tyler Yasaka
 * 
 * Modified:
 *   04/17/2016 Tyler Yasaka
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
			db.models.Program.findOne({_id: req.params.category}).exec(function(err, category){
				if(category) {
					var program = category.programs.id(req.params.program);
					if(program) {
						for(var attribute in req.body) {
							program[attribute] = req.body[attribute];
						}
					}
					category.save(function(err){
						var success = err ? false : true;
						res.send({success: success});
					});
				}
				else {
					res.send({success: false, error: 'Category does not exist'});
				}
			});
		}
	}
);

/*
 * Route: Update program in department
 * 
 * Created: 04/11/2016 Tyler Yasaka
 * 
 * Modified:
 *   04/17/2016 Tyler Yasaka
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
			db.models.Program.findOne({_id: req.params.category}).exec(function(err, category){
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
					category.save(function(err){
						var success = err ? false : true;
						res.send({success: success});
					});
				}
				else {
					res.send({success: false, error: 'Category does not exist'});
				}
			});
		}
	}
);

/*
 * Route: Remove program from category
 * 
 * Created: 04/11/2016 Tyler Yasaka
 * 
 * Modified:
 *   04/17/2016 Tyler Yasaka
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
			db.models.Program.findOne({_id: req.params.category}).exec(function(err, category){
				if(category) {
					var program = category.programs.id(req.params.program);
					if(program) {
						program.remove();
					}
					category.save(function(err){
						var success = err ? false : true;
						res.send({success: success});
					});
				}
				else {
					res.send({success: false, error: 'Category does not exist'});
				}
			});
		}
	}
);

/*
 * Route: Remove program from department
 * 
 * Created: 04/11/2016 Tyler Yasaka
 * 
 * Modified:
 *   04/17/2016 Tyler Yasaka
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
			db.models.Program.findOne({_id: req.params.category}).exec(function(err, category){
				if(category) {
					var department = category.departments.id(req.params.department);
					if(department) {
						var program = department.programs.id(req.params.program);
						if(program) {
							program.remove();
						}
					}
					category.save(function(err){
						var success = err ? false : true;
						res.send({success: success});
					});
				}
				else {
					res.send({success: false, error: 'Category does not exist'});
				}
			});
		}
	}
);

/*
 * Route: Update facultyAndStaff
 * 
 * Created: 04/11/2016 Tyler Yasaka
 * 
 * Modified:
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


// export these routes to the main router
module.exports = router;
