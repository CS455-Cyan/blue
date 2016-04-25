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

/*--																					--*\
								PUBLIC API ROUTES
\*--																					--*/

/*
	Route: List textSections
	Input:
	Output:
		{"success": Boolean, data: ["_id": String, "title": String]}
	Created: 03/24/2016 Tyler Yasaka
	Modified:
*/
router.get
(
	'/catalog/textSections',
	function(req, res)
	{
		var models = selectModels(req.session);
		models.TextSection.findOne().select('sections.title sections._id').exec( function(err, results) {
			var success = err ? false : true;
			res.send({
				success: success,
				data: results ? results.sections : null
			});
		});
	}
);

/*
	Route: Get textSection
	Input:
		url parameters:
			id: id of textSection
	Output:
		{"success": Boolean, data: {"_id": String, "title": String, "content": String}}
	Created: 03/24/2016 Tyler Yasaka
	Modified:
*/
router.get
(
	'/catalog/textSections/:id',
	function(req, res)
	{
		var models = selectModels(req.session);
		models.TextSection.findOne().exec(function(err, results) {
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
	Route: List generalRequirements
	Input:
	Output:
		{"success": Boolean, data: [
			{
				"_id": String,
				"area": String,
				name": String,
				"requirements": []
			}
		]}
	Created: 04/02/2016 Andrew Fisher
	Modified:
		04/17/2016 Tyler Yasaka
		04/19/2016 Tyler Yasaka
*/
router.get
(
	'/catalog/generalRequirements',
	function(req, res)
	{
		var models = selectModels(req.session);
		models.GeneralRequirement.find()
		.populate({
			path: 'requirements.items.courses',
			populate: {
				path: 'subject'
			}
		}).exec( function(err, results) {
			// we need to make sure they are in order (they may not be)
			var areas = ['I','II','III','IV','V'];
			var sorted = [];
			for(var a in areas) {
				for(var r in results) {
					if(areas[a] == results[r].area) {
						results[r].requirements = calculateCredit(results[r].requirements);
						sorted.push(results[r]);
					}
				}
			}
			var success = err ? false : true;
			res.send({
				success: success,
				data: sorted
			});
		});
	}
);

/*
	Route: List program categories
	Input:
	Output:
		{"success": Boolean, data: [
			{
				"_id": String,
				"name": String,
			}
		]}
	Created: 04/02/2016 Andrew Fisher
	Modified:
		04/08/2016 Tyler Yasaka
		04/17/2016 Tyler Yasaka
*/
router.get
(
	'/catalog/programs/categories',
	function(req, res)
	{
		var models = selectModels(req.session);
		models.Program.find().select('name').exec( function(err, results) {
			var success = err ? false : true;
			res.send({
				success: success,
				data: results
			});
		});
	}
);

/*
	Route: View category details
	Input:
		url parameters:
			category: id of category
	Output:
		{"success": Boolean, data: {
			"_id": String,
			"name": String,
			"description": String,
			"programs": [],
			"departments": [{
				"_id": String,
				"name": String,
				"description: String,
				"programs": []
			}]
		}}
	Created: 04/02/2016 Andrew Fisher
	Modified:
		04/08/2016 Tyler Yasaka
		04/17/2016 Tyler Yasaka
*/
router.get
(
	'/catalog/programs/categories/:category',
	function(req, res)
	{
		var models = selectModels(req.session);
		models.Program.findOne({_id: req.params.category})
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
		}).exec( function(err, category) {
			if(category) {
				for(var d in category.departments) {
					category.departments[d].programs = orderPrograms(category.departments[d].programs);
				}
				category.programs = orderPrograms(category.programs);
			}
			var success = err ? false : true;
			res.send({
				success: success,
				data: category
			});
		});
	}
);

/*
	Route: View department
	Input:
		url parameters:
			category: id of category
			department: id of department
	Output:
		{"success": Boolean, data: {
			"department": {
				"_id": String,
				"name": String,
				"description": String
			},
			"category": {
				"_id": String,
				"name": String
			}
		}}
	Created: 04/19/2016 Tyler Yasaka
	Modified:
*/
router.get
(
	'/catalog/programs/categories/:category/departments/:department',
	function(req, res)
	{
		var models = selectModels(req.session);
		models.Program.findOne({_id: req.params.category})
		.select('name departments')
		.exec( function(err, result) {
			if(result) {
				var department, category;
				if(result.departments) {
					department = result.departments.id(req.params.department);
				}
				category = {
					_id: result._id,
					name: result.name
				};
			}
			var success = err ? false : true;
			res.send({
				success: success,
				data: {department: department, category: category}
			});
		});
	}
);

/*
	Route: Search programs
	Input:
		payload: {"term": String}
	Output:
		{"success": Boolean, data: [
			{
				"_id": String,
				"type": String,
				"name": String,
				"description": String,
				"requirements": []
			}
		]}
	Created: 04/16/2016 Andrew Fisher
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.post
(
	'/catalog/programs/search/',
	function(req, res)
	{
		var models = selectModels(req.session);
		models.Program.find(function(err, categories) {
			var term = req.body.term.toLowerCase();
			var programsArr = [];
			for(var c in categories){
				for(var p in categories[c].programs){
					var match = false;
					var program = categories[c].programs[p];
					if( program.name.toLowerCase().indexOf(term) > -1) {
						match = true;
					}
					if( program.description.toLowerCase().indexOf(term) > -1) {
						match = true;
					}
					if(match) {
						programsArr.push(program);
					}
				}
				for(var d in categories[c].departments){
					for(var p in categories[c].departments[d].programs){
						var match = false;
						var program = categories[c].departments[d].programs[p];
						if( program.name.toLowerCase().indexOf(term) > -1) {
							match = true;
						}
						if( program.description.toLowerCase().indexOf(term) > -1) {
							match = true;
						}
						if(match) {
							programsArr.push(program);
						}
					}
				}
			}
			var success = err ? false : true;
			res.send({success: success, data: programsArr});
		});
	}
);

/*
	Route: View program in category
	Input:
		url parameters:
			category: id of category
			program: id of program
	Output:
		{"success": Boolean, data: {
			"program": {
				"_id": String,
				"type": String,
				"name": String,
				"description": String,
				"requirements": []
			},
			"category": {
				"_id": String,
				"name": String
			}
		}}
	Created: 04/17/2016 Tyler Yasaka
	Modified: 04/19/2016 Tyler Yasaka
*/
router.get
(
	'/catalog/programs/categories/:category/programs/:program',
	function(req, res)
	{
		var models = selectModels(req.session);
		models.Program.findOne({_id: req.params.category}).select('name programs')
		.populate({
			path: 'programs.requirements.items.courses',
			populate: {
				path: 'subject'
			}
		}).exec( function(err, result) {
			var program, category;
			if(result) {
				program = result.programs.id(req.params.program);
				if(program) {
					calculateCredit(program.requirements);
					category = {
						_id: result._id,
						name: result.name
					};
				}
			}
			var success = err ? false : true;
			res.send({
				success: success,
				data: {program: program, category: category}
			});
		});
	}
);

/*
	Route: View program in department
	Input:
		url parameters:
			category: id of categoryt
			department: id of departmen
			program: id of program
	Output:
		{"success": Boolean, data: {
			"program": {
				"_id": String,
				"type": String,
				"name": String,
				"description": String,
				"requirements": []
			},
			"category": {
				"_id": String,
				"name": String
			},
			"department": {
				"_id": String,
				"name": String
			}
		}}
	Created: 04/17/2016 Tyler Yasaka
	Modified:
*/
router.get
(
	'/catalog/programs/categories/:category/departments/:department/programs/:program',
	function(req, res)
	{
		var models = selectModels(req.session);
		models.Program.findOne({_id: req.params.category}).select('name departments')
		.populate({
			path: 'departments.programs.requirements.items.courses',
			populate: {
				path: 'subject'
			}
		}).exec( function(err, result) {
			var program, department, category;
			if(result) {
				var dept = result.departments.id(req.params.department);
				if(dept) {
					program = dept.programs.id(req.params.program);
					if(program) {
						calculateCredit(program.requirements);
						department = {
							_id: dept._id,
							name: dept.name
						}
					}
				}
				category = {
					_id: result._id,
					name: result.name
				};
			}
			var success = err ? false : true;
			res.send({
				success: success,
				data: {program: program, department: department, category: category}
			});
		});
	}
);

/*
	Route: List courses
	Input:
	Output:
		{"success": Boolean, data: [{
			"_id": String,
			"title": String
			"number": String,
			"description": String,
			"offerings": [],
			"subject": {
				"_id": String,
				"name": String,
				"abbreviation": String
			}
		}]}
	Created: 04/02/2016 Andrew Fisher
	Modified:
		04/08/2016 Tyler Yasaka
		04/17/2016 Tyler Yasaka
*/
router.get
(
	'/catalog/courses',
	function(req, res)
	{
		var models = selectModels(req.session);
		models.Course.find().populate('subject').exec( function(err, results) {
			var success = err ? false : true;
			res.send({
				success: success,
				data: results
			});
		});
	}
);

/*
	Route: view course
	Input:
		url parameters:
			id: id of course
	Output:
		{"success": Boolean, data: {
			"_id": String,
			"title": String
			"number": String,
			"description": String,
			"offerings": [],
			"subject": {
				"_id": String,
				"name": String,
				"abbreviation": String
			}
		}}
	Created: 04/17/2016 Tyler Yasaka
	Modified:
*/
router.get
(
	'/catalog/courses/:id',
	function(req, res)
	{
		var models = selectModels(req.session);
		models.Course.findOne({_id: req.params.id}).populate('subject').exec( function(err, result) {
			var success = err ? false : true;
			res.send({
				success: success,
				data: result
			});
		});
	}
);

/*
	Route: Search courses
	Input:
		payload: {"term": String}
	Output:
		{"success": Boolean, data: [
			{
				"_id": String,
				"title": String,
				"number": String,
				"description": String,
				"offerings": []
			}
		]}
	Created: 04/16/2016 Andrew Fisher
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.post
(
	'/catalog/courses/search/',
	function(req, res)
	{
		var models = selectModels(req.session);
		models.Course.find().populate('subject').exec(function(err, courses) {
			var term = req.body.term.toLowerCase();
			var courseArr = [];
			for(var c in courses){
				var match = false;
				// match title
				if( courses[c].title.toLowerCase().indexOf(term) > -1) {
					match = true;
				}
				// match number
				if( courses[c].number.toLowerCase().indexOf(term) > -1) {
					match = true;
				}
				// match description
				if( courses[c].description.toLowerCase().indexOf(term) > -1) {
					match = true;
				}
				// match subject name
				if( courses[c].subject.name.toLowerCase().indexOf(term) > -1) {
					match = true;
				}
				// match subject abbreviation
				if( courses[c].subject.abbreviation.toLowerCase().indexOf(term) > -1) {
					match = true;
				}
				if(match) {
					courseArr.push(courses[c]);
				}
			}
			var success = err ? false : true;
			res.send({success: success, data: courseArr});
		});
	}
);

/*
	Route: List subjects
	Input:
	Output:
		{"success": Boolean, data: [{
			"_id": String,
			"name": String
			"abbreviation": String
		}]}
	Created: 04/17/2016 Tyler Yasaka
	Modified:
*/
router.get
(
	'/catalog/subjects',
	function(req, res)
	{
		var models = selectModels(req.session);
		models.Subject.find().exec( function(err, results) {
			var success = err ? false : true;
			res.send({
				success: success,
				data: results
			});
		});
	}
);

/*
	Route: View subject and list courses for subject
	Input:
		url parameters:
			id: id of subject
	Output:
	{"success": Boolean, data: {
		"subject": {
			"_id": String,
			"name": String
			"abbreviation": String,
		},
		"courses": [{
			"_id": String,
			"title": String
			"number": String,
			"description": String,
			"offerings": []
		}]
	}}
	Created: 04/17/2016 Tyler Yasaka
	Modified:
*/
router.get
(
	'/catalog/subjects/:id',
	function(req, res)
	{
		var models = selectModels(req.session);
		models.Subject.findOne({_id: req.params.id}).exec(function(subjectErr, subject) {
			models.Course.find({subject: req.params.id}).exec( function(coursesErr, courses) {
				var success = (subjectErr || coursesErr) ? false : true;
				res.send({
					success: success,
					data: {subject: subject, courses: courses}
				});
			});
		});
	}
);

/*
	Route: Get facultyAndStaff
	Input:
	Output:
		{"success": Boolean, data:  String}
	Created: 04/11/2016 Tyler Yasaka
	Modified:
*/
router.get
(
	'/catalog/facultyAndStaff',
	function(req, res)
	{
		var models = selectModels(req.session);
		models.FacultyAndStaff.findOne().exec(function(err, result) {
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
	Route: Add textSection
	Input:
		payload: {"title": String, "content": String}
	Output:
		{"success": Boolean}
	Created: 03/24/2016 Tyler Yasaka
	Modified:
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
	Route: Update all textSections (use to re-order them)
	Input:
		payload: [{"title": String, "content": String}, {"title": String, "content": String}]
	Output:
		{"success": Boolean}
	Created: 04/14/2016 Tyler Yasaka
	Modified:
*/
router.put
(
	'/admin/catalog/textSections',
	function(req, res)
	{
		// restrict this to primary admins
		/*if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.TextSection.findOne(function(err, doc){
				req.body; // the new order
				doc.sections; // the current array
				var newArray = [];
				for id in req.body {
					for textSection in doc.sections {
						if id == textSection._id:
							newArray.push(textSection)
					}
				}
				if(doc.sections.length == newArray.length):
					doc.sections = newArray;
				textSections.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			});
		}*/
	}
);

/*
	Route: Update textSection
	Input:
		url parameters:
			id: id of textSection
		payload: {"title": String, "content": String}
	Output:
		{"success": Boolean}
	Created: 03/24/2016 Tyler Yasaka
	Modified:
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
	Route: Remove textSection
	Input:
		url parameters:
			id: id of textSection
	Output:
		{"success": Boolean}
	Created: 03/24/2016 Tyler Yasaka
	Modified:
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
	Route: Add requirement to area
	Input:
		url parameters:
			area: id of area to add program to
		payload: {"name": String, "items": []}
	Output:
		{"success": Boolean}
	Created: 04/16/2016 John Batson
	Modified:
		04/17/2016 Tyler Yasaka
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
	Route: Update requirement in area
	Input:
		url parameters:
			area: id of area containing requirement
			requirement: id of requirement
		payload: {"name": String, "items": []}
	Output:
		{"success": Boolean}
	Created: 04/16/2016 John Batson
	Modified:
		04/17/2016 Tyler Yasaka
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
	Route: Remove general requirement from area
	Input:
		url parameters:
			area: id of area containing requirement
			requirement: id of requirement
	Output:
		{"success": Boolean}
	Created: 04/16/2016 John Batson
	Modified:
		04/17/2016 Tyler Yasaka
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
	Route: Add category
	Input:
		payload: {"name": String, "description": String, "departments": [], "programs": []}
	Output:
		{"success": Boolean}
	Created: 04/15/2016 Kaitlin Snyder
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.post
(
	'/admin/catalog/programs/categories',
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
	Route: Update category
	Input:
		url parameters:
			category: id of category to update
		payload: {"name": String, "description": String, "departments": [], "programs": []}
	Output:
		{"success": Boolean}
	Created: 04/15/2016 Kaitlin Snyder
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.put
(
	'/admin/catalog/programs/categories/:category',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.Program.findOne({_id: req.params.category}).exec(function(err, category){
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
	Route: Remove category
	Input:
		url parameters:
			category: id of category to update
	Output:
		{"success": Boolean}
	Created: 04/15/2016 Kaitlin Snyder
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.delete
(
	'/admin/catalog/programs/categories/:category',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.Program.findOne({_id: req.params.category}).exec(function(err, category){
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
	Route: Add department
	Input:
		url parameters:
			category: id of category to add department to
		payload: {"name": String, "description": String, "programs": []}
	Output:
		{"success": Boolean}
	Created: 04/9/2016 Tyler Yasaka
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.post
(
	'/admin/catalog/programs/categories/:category/departments',
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
	Route: Update department
	Input:
		url parameters:
			category: id of category that department is in
			department: id of department
		payload: {"name": String, "description": String, "programs": []}
	Output:
		{"success": Boolean}
	Created: 04/9/2016 Tyler Yasaka
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.put
(
	'/admin/catalog/programs/categories/:category/departments/:department',
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
	Route: Remove department
	Input:
		url parameters:
			category: id of category that department is in
			department: id of department
	Output:
		{"success": Boolean}
	Created: 04/9/2016 Tyler Yasaka
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.delete
(
	'/admin/catalog/programs/categories/:category/departments/:department',
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
	Route: Add program to category
	Input:
		url parameters:
			category: id of category to add program to
		payload: {"type": String, "name": String, "description": String, requirements: []}
	Output:
		{"success": Boolean}
	Created: 04/11/2016 Tyler Yasaka
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.post
(
	'/admin/catalog/programs/categories/:category/programs',
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
	Route: Add program to department
	Input:
		url parameters:
			category: id of category containing department
			department: id of department to add program to
		payload: {"type": String, "name": String, "description": String, requirements: []}
	Output:
		{"success": Boolean}
	Created: 04/11/2016 Tyler Yasaka
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.post
(
	'/admin/catalog/programs/categories/:category/departments/:department/programs',
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
	Route: Update program in category
	Input:
		url parameters:
			category: id of category containing department
			program: id of program
		payload: {"type": String, "name": String, "description": String, requirements: []}
	Output:
		{"success": Boolean}
	Created: 04/11/2016 Tyler Yasaka
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.put
(
	'/admin/catalog/programs/categoies/:category/programs/:program',
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
	Route: Update program in department
	Input:
		url parameters:
			category: id of category containing department
			department: id of department containing program
			program: id of program
		payload: {"type": String, "name": String, "description": String, requirements: []}
	Output:
		{"success": Boolean}
	Created: 04/11/2016 Tyler Yasaka
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.put
(
	'/admin/catalog/programs/categories/:category/departments/:department/programs/:program',
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
	Route: Remove program from category
	Input:
		url parameters:
			category: id of category containing program
			program: id of program
	Output:
		{"success": Boolean}
	Created: 04/11/2016 Tyler Yasaka
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.delete
(
	'/admin/catalog/programs/categories/:category/programs/:program',
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
	Route: Remove program from department
	Input:
		url parameters:
			category: id of category containing department
			department: id of department containing program
			program: id of program
	Output:
		{"success": Boolean}
	Created: 04/11/2016 Tyler Yasaka
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.delete
(
	'/admin/catalog/programs/categories/:category/departments:department/programs/:program',
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
	Route: Add course subject
	Input:
		payload: {"title": String, "abbreviation": String}
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Kaitlin Snyder
	Modified:

*/
router.post
(
	'/admin/catalog/subjects',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.Subject.findOne(function(err, subjects){
				subjects.name = (req.body.name);
				subjects.abbreviation = (req.body.abbreviation);

				subjects.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			});
		}
	}
);


/*
	Route: Update course subject
	Input:
		url parameters:
			id: id of subject
		payload: {"title": String, "abbreviation": String}
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Kaitlin Snyder
	Modified:

*/
router.put
(
	'/admin/catalog/subjects/:id',
	function(req, res)
	{
		// restrict this to primary admins
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.Subject.findOne({_id: req.params.id}).update({},{ $set: req.body}).exec(
				function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
		}
	}
);

/*
	Route: Remove course subject
	Input:
		url parameters:
			id: id of subject
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Kaitlin Snyder
	Modified:
*/
router.delete
(
	'/admin/catalog/subjects/:id',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.Subject.remove({_id: req.params.id}).exec(function(err){
				var success = err ? false : true;
				res.send({success: success});
			});
		}
	}
);

/*
	Route: Add course
	Input:
		payload: {"title": String, "description": String, "number": String, "offerings": [],
				  "hours": {"min": String, "max": String}, "fee": String, "subject": {}}
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Kaitlin Snyder
	Modified:

*/
router.post
(
	'/admin/catalog/courses',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			new db.models.Course(req.body).populate('subject').save(function(err){
				var success = err ? false : true;
				res.send({success: success});
			});
		}
	}
);

/*
	Route: Update course
	Input:
		url parameters:
			id: id of course
		payload: {"title": String, "description": String, "number": String, "offerings": [],
				  "hours": {"min": String, "max": String}, "fee": String, "subject": {}}
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Kaitlin Snyder
	Modified:

*/
router.put
(
	'/admin/catalog/courses/:id',
	function(req, res)
	{
		// restrict this to primary admins
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.Course.findOne({_id: req.params.id}).update({},{ $set: req.body}).exec(
				function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
		}
	}
);

/*
	Route: Remove course
	Input:
		url parameters:
			id: id of course
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Kaitlin Snyder
	Modified:
*/
router.delete
(
	'/admin/catalog/courses/:id',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.Course.remove({_id: req.params.id}).exec(function(err){
				var success = err ? false : true;
				res.send({success: success});
			});
		}
	}
);


 /*
	Route: Update facultyAndStaff
	Input:
		payload: {"content": String}
	Output:
		{"success": Boolean}
	Created: 04/11/2016 Tyler Yasaka
	Modified:
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


/*
	Route: View change request queue
	Input:
	Output:
		{"success": Boolean, data: {
			"_id": String,
			"author": String,
			"timeOfRequest": Date,
			"timeOfApproval": Date,
			"status": String,
			"requestTypes": [],
			"newCourseInfo": {
				"syllabusFile": String,
				"title": String,
				"name": String,
				"description": String,
				"number": String,
				"hours": String,
				"fee": String,
				"prerequisitesCorequisites": String,
				"offerings": []
			},
			"revisedFacultyCredentials": {
				"needed": Boolean,
				"content": String
			},
			"courseListChange": {
				"needed": Boolean,
				"content": String
			},
			"effective": {
				"semester": String,
				"year": String
			},
			"courseFeeChange": String,
			"affectedDepartmentsPrograms": String,
			"approvedBy": String,
			"description": String,
			"comment": String
		}}
	Created: 04/23/2016 John Batson
	Modified:
 */
router.get
(
	'/admin/changeRequests/queue',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.ChangeRequest.find().exec(function(err, results) {
				var success = err ? false : true;
				res.send({
					success: success,
					data: results
				});
			});
		}
	}
);

/*
	Route: Approve change request
	Input:
		url parameters:
			id: id of change request to approve
		payload: {"comment": String}
	Output:
		{"success": Boolean}
	Created: 04/23/2016 John Batson
	Modified:
 */
router.put
(
	'/admin/changeRequests/approve/:id',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.ChangeRequest.findOne({_id: req.params.id}).exec(function(err, request){
				if(request) {
					request.status = "approved";
					request.timeOfApproval = Date.now();
					if (req.body.comment) {
						request.comment = (req.body.comment);
					}
					request.save(function(err){
						var success = err ? false : true;
						res.send({success: success});
					});
				}
				else {
					res.send({success: false, error: 'Change request does not exist'});
				}
			});
		}
	}
);

/*
	Route: Deny change request
	Input:
		url parameters:
			id: id of change request to deny
		payload: {"comment": String}
	Output:
		{"success": Boolean}
	Created: 04/23/2016 John Batson
	Modified:
 */
router.put
(
	'/admin/changeRequests/deny/:id',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.ChangeRequest.findOne({_id: req.params.id}).exec(function(err, request){
				if(request) {
					request.status = "denied";
					request.timeOfApproval = Date.now();
					if (req.body.comment) {
						request.comment = (req.body.comment);
					}
					request.save(function(err){
						var success = err ? false : true;
						res.send({success: success});
					});
				}
				else {
					res.send({success: false, error: 'Change request does not exist'});
				}
			});
		}
	}
);

 /*
	Route: Add admins
	Input:
		payload: {"username": String, "password": String}
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Andrew Fisher
	Modified:
*/
router.post
(
	'/admin/admins',
	function(req, res)
	{
		// restrict this to primary admins
		console.log(req.session);
		req.body.privilege = 2;
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			new db.models.Admin(req.body).save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
		}
	}
);

 /*
	Route: Update admins
	Input:
		payload: {"password": String}
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Andrew Fisher
	Modified:
*/
router.put
(
	'/admin/admins/:id',
	function(req, res)
	{
		// restrict this to primary admins
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.Admin.update(
				{_id: req.params.id},
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
	Route: Remove admins
	Input:
		url parameters:
			id: id of admins
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Andrew Fisher
	Modified:
*/
router.delete
(
	'/admin/admins/:id',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.Admin.remove({_id: req.params.id}).exec(function(err){
					var success = err ? false : true;
					res.send({success: success});
			});
		}
	}
);

/*
	Route: List admins
	Input:
	Output:
		{"success": Boolean, data: [{
			"_id": String,
			"username": String
			"privilege": Number
			"password": String
			"apps": [String]
		}]}
	Created: 04/23/2016 Andrew Fisher
	Modified:
*/
router.get
(
	'/admin/admins',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.Admin.find().exec( function(err, results) {
				var success = err ? false : true;
				res.send({
					success: success,
					data: results
				});
			});
		}
	}
);

/*
	Route: View admins
	Input:
		url parameters:
			id: id of admins
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Andrew Fisher
	Modified:
*/
router.get
(
	'/admin/admins/:id',
	function(req, res)
	{
		if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
		{
			db.models.Admin.findOne({_id: req.params.id}).exec( function(err, result) {
				var success = err ? false : true;
				res.send({
					success: success,
					data: result
				});
			});
		}
	}
);

/*
	Function: selectModels
	Description: select which database models to use for GET requests, based on whether admin is logged in
	Input:
		session: http session object (to check if user is logged in)
	Output:
		the selected database models object (admin or public)
	Created: Tyler Yasaka 04/24/2016
	Modified:
*/
var selectModels = function(session) {
	var models;
	if(session && (session.privilege >= privilege.primaryAdmin)) {
		models = db.models;
	}
	else {
		models = db.publicModels;
	}
	return models;
}

/*
	Function: sortAlphabeticallyByProperty
	Description: Orders objects of an array in alphabetical order of a property
	Input:
		arr: array to sort
		property: property to sort by
	Output:
		sorted array
	Created: Tyler Yasaka 04/17/2016
	Modified:
*/
var sortAlphabeticallyByProperty = function(arr, property) {
	return arr.sort(function(a, b){
		var propertyA=a[property].toLowerCase()
		var propertyB=b[property].toLowerCase();
		if (propertyA < propertyB) //sort string ascending
			return -1;
		if (propertyA > propertyB)
			return 1;
		return 0; //default return value (no sorting)
	});
}

/*
	Function: orderPrograms
	Description: Orders programs by type and then in alphabetical order of program name
	Input:
		programs: array of program objects
	Output:
		sorted array of programs
	Created: Tyler Yasaka 04/17/2016
	Modified:
*/
var orderPrograms = function(programs) {
	var types = {};
	for(var p in programs) {
		var program = programs[p];
		if(typeof types[program.type] == 'undefined') {
			types[program.type] = [];
		}
		types[program.type].push(program);
	}
	var results = [];
	if(types['major']) {
		results = results.concat(
			sortAlphabeticallyByProperty(types['major'], 'name')
		);
		delete types['major'];
	}
	if(types['minor']) {
		results = results.concat(
			sortAlphabeticallyByProperty(types['minor'], 'name')
		);
		delete types['minor']
	}
	if(types['certificate']) {
		results = results.concat(
			sortAlphabeticallyByProperty(types['certificate'], 'name')
		);
		delete types['certificate'];
	}
	for(var t in types) {
		results = results.concat(
			sortAlphabeticallyByProperty(types[t], 'name')
		);
	}
	return results;
}

/*
	Function: formatCredit
	Description: format credit for display based on min and max
	Input:
		hours: hours object with min and max properties
	Output:
		formatted credit (String)
	Created: Tyler Yasaka 04/17/2016
	Modified:
*/
var formatCredit = function(hours) {
	var credit;
	if(hours.min == hours.max) {
		credit = String(hours.min);
	}
	else {
		credit = hours.min + ' - ' + hours.max;
	}
	return credit;
}

/*
	Function: calculateCredit
	Description: Calculate credit for each item in a requirement, as well as the total credit for that requirement
	Input:
		requirements: array of program requirement objects
	Output:
		credit for each item and requirement is stored in requirements object
	Created: Tyler Yasaka 04/17/2016
	Modified:
*/
var calculateCredit = function(requirements) {
	for(var r in requirements) {
		var requirement = requirements[r];
		var total = {
			min: 0,
			max: 0
		}
		for(var i in requirement.items) {
			var item = requirement.items[i];
			var subtotal = {
				min: 0,
				max: 0
			}
			if(item.isWriteIn && !!item.writeIn && !!item.writeIn.hours && typeof item.writeIn.hours.min != 'undefined') {
				subtotal = item.writeIn.hours;
			}
			else if(item.separator == 'AND') {
				for(var c in item.courses) {
					var course = item.courses[c];
					subtotal.min += course.hours.min;
					subtotal.max += course.hours.max;
				}
			}
			else if (item.separator == 'OR' && item.courses.length) {
				subtotal.min = item.courses[0].hours.min;
				subtotal.max = item.courses[0].hours.max;
				for(var c = 1; c < item.courses.length; c++) {
					var course = item.courses[c];
					subtotal.min = Math.min(subtotal.min, course.hours.min);
					subtotal.max = Math.max(subtotal.max, course.hours.max);
				}
			}
			var credit = formatCredit(subtotal);
			total.min += subtotal.min;
			total.max += subtotal.max;
			requirements[r].items[i].credit = credit;
		}
		var totalCredit = formatCredit(total);
		requirements[r].credit = totalCredit;
	}
	return requirements;
}


// export these routes to the main router
module.exports = router;
