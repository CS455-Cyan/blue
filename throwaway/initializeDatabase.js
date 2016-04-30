/***																					***\

	Filename: scripts/initializeDatabase.js
	Authors:
			Tyler Yasaka
			Andrew Fisher

\***																					***/

var async = require('../node_modules/async');
var crypto = require('crypto');
var db = require('../models/catalog.model');

console.log("Alright. One sec...");

// Clear public databae
// This can be done asynchronously
db.connection.on('public', function() {
	db.publicModels.TextSection.remove();
	db.publicModels.GeneralRequirement.remove();
	db.publicModels.Program.remove();
	db.publicModels.Course.remove();
	db.publicModels.FacultyAndStaff.remove();
});

//Async allows us to simulate asynchronous behavior in javascript. That way these database queries execute one by one, in order.
async.waterfall([
	function(callback){
    //connect to database before trying to interact with it
    db.connection.on('admin', function(){
      callback();
    });
	},
	function(callback){
		// delete all existing textSections
		db.models.TextSection.remove({}, function(){
			callback(); // we're done. go to the next function
		});
	},
	function(callback){
    db.models.GeneralRequirement.remove({}, function(){
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
    db.models.FacultyAndStaff.remove({}, function(){
			callback(); // we're done. go to the next function
		});
	},
	function(callback){
    db.models.Admin.remove({}, function(){
			callback(); // we're done. go to the next function
		});
	},
	function(callback){
    db.models.ChangeRequest.remove({}, function(){
			callback(); // we're done. go to the next function
		});
	},
	function(callback){
		// create some sample subjects
		var subjects = [
			{
				name: "Psychology",
				abbreviation: "PY"
			},
			{
				name: "Computer Science",
				abbreviation: "CS"
			}
		];
		db.models.Subject(subjects[1]).save(function(err, result){
			callback(null, result);
		});
		db.models.Subject(subjects[0]).save();
	},
	function(subject, callback){
		// create some sample courses
		var courses = [
			{
				title: "Artificial Intelligence",
				number: "470",
				description: "Robots and stuff...",
				subject: subject._id,
				hours: {
					min: 3,
					max: 3
				},
				offerings: [
					"Fall",
					"Spring",
					"Summer"
				],
				fee: '30'
			},
			{
				title: "Programming Languages",
				number: "410W",
				description: "Fortran...",
				subject: subject._id,
				hours: {
					min: 3,
					max: 4
				}
			}
		];
		async.map(courses, function(course, cb) {
			db.models.Course(course).save(function(err, result) {
				cb(null, result._id);
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
								type: "minor",
								name: "Economics",
								description: "money money money"
							},
							{
								type: "major",
								name: "Computer Science",
								description: "not for the faint of heart",
								requirements: [{
									name: "Core Requirements",
									separator: "AND",
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
							}
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
				db.models.Program(programs[i]).save();
			}
			callback();
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

					separator: "OR",
					items: [
						{
							separator: 'AND',
							courses: [],
							writeIn: {
								content: "Sing the alphabet backwards",
								hours: {
									min: 1,
									max: 3
								}
							},
							isWriteIn: true
						},
						{
							separator: 'AND',
							courses: [],
							isWriteIn: true,
							writeIn: {
								content: "Sing the alphabet backwards 2",
								hours: {
									min: 1,
									max: 3
								}
							}
						}
					]
				}]
			},
			{
				area: 'II',
				name: "Humanities and Fine Arts",
				requirements: [{
					name: "requirement",
					items: [{
						separator: 'OR',
						courses: [],
						isWriteIn: false
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
						courses: [],
						isWriteIn: false
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
						courses: [],
						isWriteIn: false
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
						courses: [],
						isWriteIn: false
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

		// create some sample changeRequests
		var changes = [
			{
				author: "Sean Connery",
			 	timeOfRequest: Date.now(),
				timeOfApproval: null,
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
			//db.models.ChangeRequest(changes[i]).save();
		}
		// create some sample adminSection
		var admins = [
			{
				privilege: 5,
				username: "primaryAdmin",
				apps: ['catalog'],
				password: crypto.createHash('md5').update("punchcards_rock").digest('hex')
			},
			{
				privilege: 2,
				username: "secondaryAdmin",
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
