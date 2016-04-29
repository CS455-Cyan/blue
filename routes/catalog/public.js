/***																					***\

	Filename: api/routes/public.js
	Authors:
			Andrew Fisher

\***																					***/

// housekeeping
var globals = require('../global');
var modules = globals.modules;
var db = require('../../models/catalog.model');
var isAuthenticated = globals.isAuthenticated;
var router = modules.express.Router();
var definitions = require('./definitions');
var privilege = definitions.privilege;
var calculateCredit = definitions.calculateCredit;
var orderPrograms = definitions.orderPrograms;

var publicExports = {};

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
publicExports.getTextSections = function(req, res) {
	db.models.TextSection.findOne().select('sections.title sections._id').exec( function(err, results) {
		var success = err ? false : true;
		res.send({
			success: success,
			data: results ? results.sections : null
		});
	});
};

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
publicExports.getTextSectionsById = function(req, res)
{
	db.models.TextSection.findOne().exec(function(err, results) {
		var section = results.sections.id(req.params.id);
		var success = err || !section ? false : true;
		res.send({
			success: success,
			data: section
		});
	});
};

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
publicExports.listGeneralRequirements = function(req, res)
{
	db.models.GeneralRequirement.find()
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
};

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
publicExports.listProgramCategories = function(req, res)
{
	db.models.Program.find().select('name').exec( function(err, results) {
		var success = err ? false : true;
		res.send({
			success: success,
			data: results
		});
	});
};

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
publicExports.viewCategoryDetails = function(req, res)
{
	db.models.Program.findOne({_id: req.params.category})
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
};

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
publicExports.viewDepartment = function(req, res)
{
	db.models.Program.findOne({_id: req.params.category})
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
};

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
publicExports.searchPrograms = function(req, res)
{
	db.models.Program.find(function(err, categories) {
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
};

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
publicExports.viewProgramsInCategory = function(req, res)
{
	db.models.Program.findOne({_id: req.params.category}).select('name programs')
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
};

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
publicExports.viewProgramsInDepartment = function(req, res)
{
	db.models.Program.findOne({_id: req.params.category}).select('name departments')
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
};

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
publicExports.listCourses = function(req, res)
{
	db.models.Course.find().populate('subject').exec( function(err, results) {
		var success = err ? false : true;
		res.send({
			success: success,
			data: results
		});
	});
};

/*
	Route: View Course
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
publicExports.viewCourses = function(req, res)
{
	models.Course.findOne({_id: req.params.id}).populate('subject').exec( function(err, result) {
		var success = err ? false : true;
		res.send({
			success: success,
			data: result
		});
	});
};

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
publicExports.searchCourses = function(req, res)
{
	db.models.Course.find().populate('subject').exec(function(err, courses) {
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
};

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
publicExports.listSubjects = function(req, res)
{
	db.models.Subject.find().exec( function(err, results) {
		var success = err ? false : true;
		res.send({
			success: success,
			data: results
		});
	});
};

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
publicExports.listCoursesForSubject = function(req, res)
{
	db.models.Subject.findOne({_id: req.params.id}).exec(function(subjectErr, subject) {
		models.Course.find({subject: req.params.id}).exec( function(coursesErr, courses) {
			var success = (subjectErr || coursesErr) ? false : true;
			res.send({
				success: success,
				data: {subject: subject, courses: courses}
			});
		});
	});
};

/*
	Route: Get facultyAndStaff
	Input:
	Output:
		{"success": Boolean, data:  String}
	Created: 04/11/2016 Tyler Yasaka
	Modified:
*/
publicExports.getFacultyAndStaff = function(req, res)
{
	db.models.FacultyAndStaff.findOne().exec(function(err, result) {
		var success = err ? false : true;
		res.send({
			success: success,
			data: result.content
		});
	});
};

module.exports = publicExports;
