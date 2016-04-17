/***																					***\

	Filename: scripts/initializeDatabase.js
	Authors:
			Tyler Yasaka
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
    db.models.Subject.remove({}, function(){
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
    db.models.FacultyAndStaff.remove({}, function(){
			callback(); // we're done. go to the next function
		});	
	},
	function(callback){
    db.models.ChangeRequest.remove({}, function(){
			callback(); // we're done. go to the next function
		});	
	},
	function(callback){
		// create some sample textSections
		var textSections = {
			sections: [
				{title: "University Information", content: "Yolo."},
				{title: "Academic Procedures", content: "Blah blah blah."}
			]
		};
		db.models.TextSection(textSections).save();
		
		// create some sample generalRequirements
		var requirements = [
			{
				area: 'I',
				name: "Written Composition",
				requirements: [{
					name: "requirement",
					items: [{
						separator: 'AND',
						courses: [],
						write_in: "optional"
					}]
				}]
			},
			{
				area: 'II',
				name: "Humanities and Fine Arts",
				requirements: [{
					name: "requirement",
					items: [{
						separator: 'OR',
						courses: []
					}]
				}]
			},
			{
				area: 'III',
				name: "Natural Sciences and Mathematics",
				requirements: [{
					name: "requirement",
					items: [{
						separator: 'OR',
						courses: []
					}]
				}]
			},
			{
				area: 'IV',
				name: "History, Social and Behavioral Sciences",
				requirements: [{
					name: "requirement",
					items: [{
						separator: 'OR',
						courses: []
					}]
				}]
			},
			{
				area: 'V',
				name: "Additional Requirements",
				requirements: [{
					name: "requirement",
					items: [{
						separator: 'OR',
						courses: []
					}]
				}]
			}
		];
		// Add the areas in order
		async.eachSeries(requirements, function(requirement, callback) {
			db.models.GeneralRequirement(requirement).save(function() {
				callback();
			});
		});
		
		db.models.FacultyAndStaff({content: "Dr. Roden..."}).save();
		
		// create some sample subjects
		var subjects = [
			{
				name: "Computer Science",
				abbreviation: "CS"
			}
		];
		db.models.Subject(subjects[0]).save(function(err, result){
			// create some sample courses
			var courses = [
				{
					title: "Artificial Intelligence",
					number: "470",
					description: "Robots and stuff...",
					subject: result._id
				},
				{
					title: "Programming Languages",
					number: "410W",
					description: "Fortran...",
					subject: result._id
				}
			];
			async.map(courses, function(course, callback) {
				db.models.Course(courses[i]).save(function(err, result) {
					callback(null, result._id);
				});
			}, function(err, results) {
				
				// create some sample programs
				var programs = [
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
									description: "not for the faint of heart",
									requirements: [{
										name: "Core Requirements",
										items: [
											{
												separator: 'AND',
												courses: [
													results[0]
												]
											},
											{
												separator: 'AND',
												courses: [
													results[1]
												]
											}
										]
									}]
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
		    ];
				for(var i in programs){
					db.models.Program(programs[i]).save(function(err, results){
		      });
				}

			});
		});
		
		// create some sample changeRequests
		var changes = [
			{
				author: "Sean Connery",
			 	timeOfRequest: Date.now(),
				timeOfApproval: Date.now(),
				status: "pending",
				requestTypes: [
					"Change in Course Description",
				],
				revisedFacultyCredentials: {
					needed: false,
					content: null
				},
				courseListChange: {
					needed: false,
					content: null
				},
				effective: {
					semester: "Fall",
					year: "2016"
				},
				courseFeeChange: null,
				affectedDepartmentsPrograms: "Computer Science and Information Systems",
				approvedBy: "Renee Vandiver",
				description: "Change course description for CS310 to 'learning how to write assembly for a computer nobody uses any more'"
			},
			{
				author: "Sean Connery",
			 	timeOfRequest: Date.now(),
				timeOfApproval: Date.now(),
				status: "approved",
				requestTypes: [
					"Addition of/Change in Course Fee",
				],
				revisedFacultyCredentials: {
					needed: false,
					content: null
				},
				courseListChange: {
					needed: false,
					content: null
				},
				effective: {
					semester: "Fall",
					year: "2016"
				},
				courseFeeChange: null,
				affectedDepartmentsPrograms: "Computer Science and Information Systems",
				approvedBy: "Renee Vandiver",
				description: "Change course fee for CS455 to $3000 so nobody can graduate. hehe"
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
