/*--																					--*\
						PRIMARY ADMIN API ROUTES
\*--																					--*/

var primaryExports = {};

/* Add Text Section */
primaryExports.addTextSection = function(req, res){
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
};

/* Reorder Text Sections */
primaryExports.reorderTextSections = function(req, res){
	// restrict this to primary admins
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.TextSection.findOne(function(err, doc){
			var reordered = [];
			for(i in req.body) {
				var id = req.body[i]._id;
				for(var j in doc.sections) {
					var textSection = doc.sections[j];
					if(id == textSection._id) {
						reordered.push(textSection);
					}
				}
			}
			// Make sure the length of the original array and the reordered array are the same
			// If they're not the same, an error must have occured and we will probably lose data.
			if(doc.sections.length == reordered.length) {
				doc.sections = reordered;
			}
			doc.save(function(err){
				var success = err ? false : true;
				res.send({success: success});
			});
		});
	}
};

/* Update Text Section */
primaryExports.updateTextSection = function(req, res){
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
};

/* Remove Text Section */
primaryExports.removeTextSection = function(req, res){
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
};

/* Add Requirement to Area */
primaryExports.addRequirementToArea = function(req, res){
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
};

/* Update Requirement in Area */
primaryExports.updateRequirementInArea = function(req, res){
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
};

/* Remove General Requirement from Area */
primaryExports.removeGeneralRequirementFromArea = function(req, res){
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
};

/* Add Category */
primaryExports.addCategory = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.Program(req.body).save(function(err){
			var success = err ? false : true;
			res.send({success: success});
		});
	}
};

/* Update Category */
primaryExports.updateCategory = function(req, res){

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
};

/* Remove Category */
primaryExports.removeCategory = function(req, res){
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
};

/* Add Department */
primaryExports.addDepartment = function(req, res){
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
};

/* Update Department */
primaryExports.updateDepartment = function(req, res){
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
};

/* Remove Department */
primaryExports.removeDepartment = function(req, res){
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
};

/* Add Program to Category */
primaryExports.addProgramToCategory = function(req, res){
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
};

/* Add Program to Department */
primaryExports.addProgramToDepartment = function(req, res){
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
};

/* Update Program in Category */
primaryExports.updateProgramInCategory = function(req, res){
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
};

/* Update Program in Department */
primaryExports.updateProgramInDepartment = function(req, res){
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
};

/* Remove Program from Category */
primaryExports.removeProgramFromCategory = function(req, res){
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
};

/* Remove Program from Department */
primaryExports.removeProgramFromDepartment = function(req, res){
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
};

/* Add Course Subject */
primaryExports.addCourseSubject = function(req, res){
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
};

/* Update Course Subject */
primaryExports.updateCourseSubject = function(req, res){
	// restrict this to primary admins
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.Subject.findOne({_id: req.params.id}).update({},{ $set: req.body}).exec(
			function(err){
				var success = err ? false : true;
				res.send({success: success});
			});
	}
};

/* Remove Course Subject */
primaryExports.removeCourseSubject = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.Subject.remove({_id: req.params.id}).exec(function(err){
			var success = err ? false : true;
			res.send({success: success});
		});
	}
};

/* Add Course */
primaryExports.addCourse = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		new db.models.Course(req.body).populate('subject').save(function(err){
			var success = err ? false : true;
			res.send({success: success});
		});
	}
};

/* Update Course */
primaryExports.updateCourse = function(req, res){
	// restrict this to primary admins
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.Course.findOne({_id: req.params.id}).update({},{ $set: req.body}).exec(
			function(err){
				var success = err ? false : true;
				res.send({success: success});
			});
	}
};

/* Remove Course */
primaryExports.removeCourse = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.Course.remove({_id: req.params.id}).exec(function(err){
			var success = err ? false : true;
			res.send({success: success});
		});
	}
};

/* Update Faculty and Staff */
primaryExports.updateFacultyAndStaff = function(req, res){
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
};

/* Change Password */
primaryExports.changePassword = function(req, res){
	if(isAuthenticated(appname, privilege.secondaryAdmin, req.session, res))
	{
		db.models.Admin.update({ author: req.session.username},
		{ $set: req.body }).exec(function(err, request){
			var success = err ? false : true;
			res.send({success: success});
		});
	}
};

/* View Change Request Queue */
primaryExports.viewChangeRequestQueue = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.ChangeRequest.find({status: "pending"}).exec(function(err, results) {
			var success = err ? false : true;
			res.send({
				success: success,
				data: results
			});
		});
	}
};

/* Approve Change Request */
primaryExports.approveChangeRequest = function(req, res){
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
};

/* Deny Change Request */
primaryExports.denyChangeRequest = function(req, res){
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
};

/* Add Admin */
primaryExports.addAdmin = function(req, res){
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
};

/* Update Admin */
primaryExports.updateAdmin = function(req, res){
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
};

/* Remove Admin */
primaryExports.removeAdmin = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.Admin.remove({_id: req.params.id}).exec(function(err){
				var success = err ? false : true;
				res.send({success: success});
		});
	}
};

/* List Admins */
primaryExports.listAdmins = function(req, res){
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
};

/* View Admin */
primaryExports.viewAdmin = function(req, res){
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
};

