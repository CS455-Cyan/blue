/*--																					--*\
						SECONDARY ADMIN API ROUTES
\*--																					--*/

var secondaryExports = {};

/* View Change Requests (created by that admin) */
secondaryExports.viewChangeRequests = function(req, res){
	// restrict this to primary and secondary admins
	if(isAuthenticated(appname, privilege.secondaryAdmin, req.session, res))
	{
		db.models.ChangeRequest.find({author: req.session.username}).exec(function(err, results){
				var success = err ? false : true;
				res.send({success: success, data: results});
		});
	}
};

/* Create Change Request */
secondaryExports.createChangeRequest = function(req, res){
	// restrict this to primary and secondary admins
	if(isAuthenticated(appname, privilege.secondaryAdmin, req.session, res))
	{
		if(req.session.privilege >= privilege.primaryAdmin){
			req.body.status = "approved";
		}
		else{
			req.body.status = "pending";
		}
		req.body.author = req.session.username;
		new db.models.ChangeRequest(req.body).save(function(err){
			var success = err ? false : true;
			res.send({success: success});
		});
	}
};

/* Edit Change Request */
secondaryExports.editChangeRequest = function(req, res){
	// restrict this to primary and secondary admins
	if(isAuthenticated(appname, privilege.secondaryAdmin, req.session, res))
	{
		db.models.ChangeRequest.update({_id: req.params.id, status: "pending"},
		{ $set: req.body }).exec(function(err, request){
			var success = err ? false : true;
			res.send({success: success});
		});
	}
};

/* Remove Change Request */
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

/* View Change Log */
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