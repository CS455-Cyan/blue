/***																					***\

	Filename: states.js
	Author: Mitchel R Moon

	Copyright (c) 2015 University of North Alabama

\***																					***/

var globals = require('./global');
var modules = globals.modules;
var isAuthenticated = globals.isAuthenticated;

// connect to collection
var mongoClient = modules.mongodb.MongoClient;
var ObjectId = modules.mongodb.ObjectID;

var db = {};

mongoClient.connect
(
	'mongodb://localhost:27017/apps',
	function(err, database)
	{
		if(!err)
		{
			db.states = database.collection('states');
		}
	}
);

// configure routes

var router = modules.express.Router();

/*																							*\
	@name: getStates

	@parameters:
		req: (Object) http request
		res: (Object) http response

	@description:
		retrieve states from the states data store

	@return:
		(Array) state list
\*																							*/
var getStates =
	function(req, res)
	{
		db.states.find().toArray
		(
			function(err, records)
			{
				if(!err)
				{
					res.send
					(
						{
							'success': true,
							'results': records
						}
					);
				}
				else
				{
					res.send
					(
						{
							'success': false
						}
					);
				}
			}
		);
	};

/*--																					--*\
								PUBLIC API ROUTES
\*--																					--*/

router.get
(
	'/states',
	function(req, res)
	{
		getStates(req, res);
	}
);

/*--																					--*\
								PRIVATE API ROUTES
\*--																					--*/

router.post
(
	'/admin/states',
	function(req, res)
	{
		var appname = 'utilities';
		var privilege = 1;

		if(isAuthenticated(appname, privilege, req.session, res))
		{
			db.states.insert
			(
				{
					'name': req.body.stateName,
					'abbr': req.body.stateAbbr
				},
				function(err, records)
				{
					var success = false;

					if(!err)
					{
						success = true;
					}

					res.send
					(
						{
							'success': success
						}
					);
				}
			);
		}
	}
);

router.get
(
	'/admin/states',
	function(req, res)
	{
		getStates(req, res);
	}
);

router.get
(
	'/admin/states/:id',
	function(req, res)
	{
		var appname = 'utilities';
		var privilege = 1;

		if(isAuthenticated(appname, privilege, req.session, res))
		{
			var id = req.params.id;

			db.states.find
			(
				{
					'_id': ObjectId(id)
				}
			).toArray
			(
				function(err, records)
				{
					if(!err)
					{
						res.send
						(
							{
								'success': true,
								'results': records[0]
							}
						);
					}
					else
					{
						res.send
						(
							{
								'success': false
							}
						);
					}
				}
			);
		}
	}
);

router.put
(
	'/admin/states',
	function(req, res)
	{
		var appname = 'utilities';
		var privilege = 1;

		if(isAuthenticated(appname, privilege, req.session, res))
		{
			var id = req.body.id;

			db.states.update
			(
				{
					'_id': ObjectId(id)
				},
				{
					$set:
					{
						'name': req.body.stateName,
						'abbr': req.body.stateAbbr
					}
				}
			);

			res.send
			(
				{
					'success': true
				}
			);
		}
	}
);

router.delete
(
	'/admin/states/:id',
	function(req, res)
	{
		var appname = 'utilities';
		var privilege = 1;

		if(isAuthenticated(appname, privilege, req.session, res))
		{
			if(db.states)
			{
				var id = req.params.id;

				db.states.find
				(
					{
						'_id': ObjectId(id)
					}
				).toArray
				(
					function(err, records)
					{
						if(!err)
						{
							db.states.update
							(
								{
									'_id': ObjectId(id)
								},
								{
									$set:
									{
										deleted: true
									}
								}
							);

							res.send
							(
								{
									'success': true
								}
							);
						}
						else
						{
							res.send
							(
								{
									'success': false
								}
							);
						}
					}
				);
			}
		}
	}
);

module.exports = router;
