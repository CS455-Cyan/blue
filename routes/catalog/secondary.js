/***																					***\

	Filename: routes/secondary.js
	Authors:
			Kaitlin Snyder

\***	
/*--																					--*\
						SECONDARY ADMIN API ROUTES
\*--																					--*/

// housekeeping
var globals = require('../global');
var modules = globals.modules;
var crypto = require('crypto');
var db = require('../../models/catalog.model');
var isAuthenticated = globals.isAuthenticated;
var router = modules.express.Router();
var definitions = require('./definitions');
var privilege = definitions.privilege;
var appname = definitions.appname;

var secondaryExports = {};

 /*
	Route: Change password
	Input:
		payload: {"password": String}
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Andrew Fisher
	Modified:
		04/30/2016 Andrew Fisher
		04/30/2016 John Batson
*/
secondaryExports.changePassword = function(req, res){
	// restrict this to primary and secondary admins
	if(isAuthenticated(appname, privilege.secondaryAdmin, req.session, res))
	{
		req.body.password = crypto.createHash('md5').update(req.body.password).digest('hex');
		db.models.Admin.findOne({username: req.session.username}).exec(function(err, user){
			if(user){
				user.password = req.body.password;
				user.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			}
		});
		
	}
};

/*
	Route: View change requests (created by that admin)
	Input:
	Output:
		{"success": Boolean,
		 "data": {
			"_id": String,
			"author": String,
			"username": String,
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
	Created: 04/24/2016 Andrew Fisher
	Modified:
		04/30/2016 John Batson
 */
secondaryExports.viewChangeRequests = function(req, res){
	// restrict this to primary and secondary admins
	if(isAuthenticated(appname, privilege.secondaryAdmin, req.session, res))
	{
		db.models.ChangeRequest.find({username: req.session.username}).exec(function(err, results){
				var success = err ? false : true;
				res.send({success: success, data: results});
		});
	}
};

/*
	Route: Create change request
	Input:
		payload: {
			"author": String,
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
			"description": String
		}
		file: file
	Output:

	Created: 04/24/2016 Andrew Fisher
	Modified:
		04/30/2016 John Batson
 */
secondaryExports.createChangeRequest = function(req, res){
	// restrict this to primary and secondary admins
	if(isAuthenticated(appname, privilege.secondaryAdmin, req.session, res))
	{
		if(req.session.privilege >= privilege.primaryAdmin){
			req.body.status = "approved";
			req.body.timeOfApproval = Date.now();
		}
		else{
			req.body.status = "pending";
			req.body.timeOfApproval = null;
			req.body.comment = null;
		}
		req.body.timeOfRequest = Date.now();
		req.body.username = req.session.username;
		
		new db.models.ChangeRequest(req.body).save(function(err){
			var success = err ? false : true;
			res.send({success: success});
		});
	}
};

/*
	Route: Edit change request
	Input:
		payload: {"effective": {
					"semester": String,
					"year": String
					}}
	Output:

	Created: 04/24/2016 Andrew Fisher
	Modified:
 */
secondaryExports.editChangeRequest = function(req, res){
	// restrict this to primary and secondary admins
	if(isAuthenticated(appname, privilege.secondaryAdmin, req.session, res))
	{
		db.models.ChangeRequest.update({_id: req.params.id, status: "pending"},
		{ $set: req.body }).exec(function(err){
			var success = err ? false : true;
			res.send({success: success});
		});
	}
};

/*
	Route: Remove change request
	Input:
		url parameters:
			id: id of course
	Output:

	Created: 04/24/2016 Andrew Fisher
	Modified:
 */
secondaryExports.removeChangeRequest = function(req, res){
	// restrict this to primary and secondary admins
	if(isAuthenticated(appname, privilege.secondaryAdmin, req.session, res))
	{
		db.models.ChangeRequest.remove({_id: req.params.id, status: "pending"}).exec(function(err){
				var success = err ? false : true;
				res.send({success: success});
		});
	}
};

/*
	Route: View change log
	Input:
	Output:
		{"success": Boolean,
		 "data": {
			"_id": String,
			"author": String,
			"username": String,
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
	Created: 04/24/2016 Andrew Fisher
	Modified:
 */
secondaryExports.viewChangeLog = function(req, res){
	// restrict this to primary and secondary admins
	if(isAuthenticated(appname, privilege.secondaryAdmin, req.session, res))
	{
		db.models.ChangeRequest.find({status: "approved"}).exec(function(err, results){
				var success = err ? false : true;
				res.send({success: success, data: results});
		});
	}
};

module.exports = secondaryExports;
