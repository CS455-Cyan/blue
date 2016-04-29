/***																					***\

	Filename: api/routes/public.js
	Authors:
			Andrew Fisher

\***																					***/

// housekeeping
var globals = require('./global');
var modules = globals.modules;
var db = require('../models/catalog.model');
var isAuthenticated = globals.isAuthenticated;
var router = modules.express.Router();
var multer = require('multer');
var definitions = require('./definitions');
var privilege = definitions.privilege;


var fileStorage = modules.multer.diskStorage({
	destination: function(req, file, cb)
	{
	  cb(null, __dirname + '/../uploads/catalog')
	},
	filename: function(req, file, cb)
	{
		cb(null, Date.now() + '-' + file.originalname);
	}
});

var publicExports = {};

/*--																					--*\
								PUBLIC API ROUTES
\*--																					--*/


/*	Get Text Sections	*/
publicExports.getTextSections = function(req, res) {
	var models = selectModels(req.session);
	models.TextSection.findOne().select('sections.title sections._id').exec( function(err, results) {
		var success = err ? false : true;
		res.send({
			success: success,
			data: results ? results.sections : null
		});
	});
};

/*	Get Text Sections By Id	*/
publicExports.getTextSectionsById = function(req, res)
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
};

/*	List The General Requirements	*/
publicExports.listGeneralRequirements = function(req, res)
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
};

/*	List Program Categories	*/
publicExports.listProgramCategories = function(req, res)
{
	var models = selectModels(req.session);
	models.Program.find().select('name').exec( function(err, results) {
		var success = err ? false : true;
		res.send({
			success: success,
			data: results
		});
	});
};

/*	View Category Details	*/
publicExports.viewCategoryDetails = function(req, res)
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
};

/*	View Departments	*/
publicExports.viewDepartment = function(req, res)
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
};

/*	Search Programs	*/
publicExports.searchPrograms = function(req, res)
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
};

/*	View Programs In Category	*/
publicExports.viewProgramsInCategory = function(req, res)
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
};

/*	View Programs In Departments	*/
publicExports.viewProgramsInDepartment = function(req, res)
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
};

/*	List Courses	*/
publicExports.listCourses = function(req, res)
{
	var models = selectModels(req.session);
	models.Course.find().populate('subject').exec( function(err, results) {
		var success = err ? false : true;
		res.send({
			success: success,
			data: results
		});
	});
};

/*	View Courses	*/
publicExports.viewCourses = function(req, res)
{
	var models = selectModels(req.session);
	models.Course.findOne({_id: req.params.id}).populate('subject').exec( function(err, result) {
		var success = err ? false : true;
		res.send({
			success: success,
			data: result
		});
	});
};

/*	Search Courses	*/
publicExports.searchCourses = function(req, res)
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
};

/*	List Subjects	*/
publicExports.listSubjects = function(req, res)
{
	var models = selectModels(req.session);
	models.Subject.find().exec( function(err, results) {
		var success = err ? false : true;
		res.send({
			success: success,
			data: results
		});
	});
};

/*	View subject and list courses for subject	*/
publicExports.listCoursesForSubject = function(req, res)
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
};

/*	Get Faculty And Staff	*/
publicExports.getFacultyAndStaff = function(req, res)
{
	var models = selectModels(req.session);
	models.FacultyAndStaff.findOne().exec(function(err, result) {
		var success = err ? false : true;
		res.send({
			success: success,
			data: result.content
		});
	});
};


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
	console.log(db.models, db.publicModels, "check");
	if(session && (session.privilege >= privilege.primaryAdmin)) {
		models = db.models;
	}
	else {
		models = db.publicModels;
	}
	return models;
}

module.exports = publicExports;