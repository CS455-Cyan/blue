/***																					***\

	Filename: scripts/initializeDatabase.js
	Authors: Tyler Yasaka
			Andrew Fisher

\***																					***/

var async = require('../api/node_modules/async');
var crypto = require('crypto');
var db = require('../api/models/catalog.model');

console.log("Alright. One sec...");

//Async allows us to simulate asynchronous behavior in javascript. That way these database queries execute one by one, in order.
async.waterfall([
	function(callback){
		
		// connect to mongoose
		db.mongoose.connect('mongodb://cyan:8029df8b@ds035603.mongolab.com:35603/apps');
		var connection = db.mongoose.connection;
		connection.on('error', console.error.bind(console, 'connection error:'));
		connection.once('open', function() {
			callback(); // now that the connection's open, proceed to the next function
		});
	},
	function(callback){
		// delete all existing textSections and programSections
		db.models.TextSection.remove({}, function(){
			callback(); // we're done. go to the next function
		});
	},
	function(callback){
		db.models.Program.remove({}, function(){
			callback(); // we're done. go to the next function
		});	
	},
	function(callback){
    db.models.Course.remove({}, function(){
			callback(); // we're done. go to the next function
		});	
	},
	function(callback){
    db.models.ChangeRequest.remove({}, function(){
			callback(); // we're done. go to the next function
		});
	},
	function(callback){
    db.models.GeneralRequirement.remove({}, function(){
			callback(); // we're done. go to the next function
		});	
	},
	function(callback){
    db.models.Admin.remove({}, function(){
			callback(); // we're done. go to the next function
		});	
	},
	function(callback){
		// create some sample textSections
		var sections = [
			{title: "University Information", content: "Yolo."},
			{title: "Academic Procedures", content: "Blah blah blah."}
		];
		for(var i in sections){
			db.models.TextSection(sections[i]).save();
		}
		// create some sample generalRequirements
		var requirements = [{
			areaI: [{
				name: "Written Composition",
				requirements: [{
					name: "requirement",
					items: [{
						separator: true,
						courses: [],
						write_in: "optional"
					}]
				}]
			}],
			areaII: [{
				name: "Humanities and Fine Arts",
				requirements: [{
					name: "requirement",
					items: [{
						separator: false,
						courses: []
					}]
				}]
			}],
			areaIII: [{
				name: "Natural Sciences and Mathematics",
				requirements: [{
					name: "requirement",
					items: [{
						separator: false,
						courses: []
					}]
				}]
			}],
			areaIV: [{
				name: "History, Social and Behavioral Sciences",
				requirements: [{
					name: "requirement",
					items: [{
						separator: false,
						courses: []
					}]
				}]
			}],
			areaV: [{
				name: "Additional Requirements",
				requirements: [{
					name: "requirement",
					items: [{
						separator: false,
						courses: []
					}]
				}]
			}],
		}];
		for(var i in requirements){
			db.models.GeneralRequirement(requirements[i]).save();
			//console.log(requirements[i]);
		}
		// create some sample programSections
		var programs = [{
			categories: [
        {
          name: "College of Business",
          description: "Hr Hm Business Hum",
          departments: [{
            name: "Computer Science and Information Systems",
            description: "CS and CIS are not the same thing",
            programs: [
							{
								type: "major",
								name: "Computer Science",
								description: "not for the faint of heart"
							},
							{
								type: "minor",
								name: "Human-Computer Interaction/User Experience",
								description: "emotional impact cannot be designed - only experienced"
							},
            ]
          }],
          programs: [{
            type: "type",
            name: "name",
            description: "description"
          }]
        },
        {
					name: "College of Arts and Sciences",
					departments: [],
					programs: []
				}
      ]
		}];
		for(var i in programs){
			db.models.Program(programs[i]).save(function(err, results){
      });
		}
		// create some sample courseSections
		var courses = [{
			subjects: [{
				name: "Computer Science",
				abbreviation: "CS",
				courses: [
					{
						title: "Artificial Intelligence",
						number: "470",
						description: "Robots and stuff..."
					},
					{
						title: "Programming Languages",
						number: "410W",
						description: "Fortran..."
					}
				]
			}]
		}];
		for(var i in courses){
			db.models.Course(courses[i]).save();
		}
		// create some sample changeRequests
		var changes = [
			{
				author: "Sean Connery",
			 	timeOfRequest: "Long time ago.",
				timeOfApproval: "Wouldn't you like to know",
				status: "pending"
			},
			{
				author: "Sean Connery",
			 	timeOfRequest: Date.now(),
				timeOfApproval: Date.now(),
				status: "approved"
			}
		];
		for(var i in changes){
			db.models.ChangeRequest(changes[i]).save();
		}
		// create some sample adminSection
		var admins = [
			{
				privilege: 5,
				username: "lanel52",
				apps: ['catalog'],
				password: crypto.createHash('md5').update("punchcards_rock").digest('hex')
			}
		];
		for(var i in admins){
			db.models.Admin(admins[i]).save();
		}
		callback(); // we're done. go to the next function
	},
	function(callback){
		// keep adding more functions baby...
		callback();
	}
], function() {
	console.log("Ok I'm done.");
});
