/***																					***\

	Filename: scripts/initializeDatabase.js
	Authors: Tyler Yasaka
			Andrew Fisher

\***																					***/

var async = require('../api/node_modules/async');
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
		db.models.ProgramSection.remove({}, function(){
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
			console.log('blah');
		}
		// create some sample generalRequirements
		var requirements = [{
			areaI: [{
				requirement: [{
					name: "Text Field",
					courseList: {
						items: {
							separator: true,
							courses: "courses",
							write_in: "optional"
						},
					}
				}]
			}],
			areaII: [{
				requirement: [{
					name: "Text Field",
					courseList: {
						items: {
							separator: true,
							courses: "courses",
							write_in: "optional"
						},
					}
				}]
			}],
			areaIII: [{
				requirement: [{
					name: "Text Field",
					courseList: {
						items: {
							separator: true,
							courses: "courses",
							write_in: "optional"
						},
					}
				}]
			}],
			areaIV: [{
				requirement: [{
					name: "Text Field",
					courseList: {
						items: {
							separator: true,
							courses: "courses",
							write_in: "optional"
						},
					}
				}]
			}],
			areaV: [{
				requirement: [{
					name: "Text Field",
					courseList: {
						items: {
							separator: true,
							courses: "courses",
							write_in: "optional"
						},
					}
				}]
			}]
		}];
		for(var i in requirements){
			db.models.GeneralRequirements(requirements[i]).save();
			console.log('yada');
		}
		// create some sample programSections
		var programs = [{
			categories: [{
				name: "name",
				description: "description",
				departments: [{
					name: "name",
					description: "description",
					programs: [{
						type: "type",
						name: "name",
						description: "description"
					}],
				}],
				programs: [{
					type: "type",
					name: "name",
					description: "description"
				}],
			}],
		}];
		for(var i in programs){
			db.models.ProgramSection(programs[i]).save();
			console.log('asdf');
		}
		// create some sample courseSections
		var courses = [{
			subjects: {
				name: "University Information",
				abbreviation: "Yolo.",
				courses: {
					title: "title",
					number: "number",
					description: "description"
				},
			},
		}];
		for(var i in courses){
			db.models.CourseSection(courses[i]).save();
			console.log('jkl;');
		}
		// create some sample changeRequests
		var changes = [
			{author: "Sean Connery", timeOfRequest: "Long time ago.", timeOfApproval: "Wouldn't you like to know", status: "incomplete"}
		];
		for(var i in changes){
			db.models.ChangeRequests(changes[i]).save();
			console.log('123');
		}
		// create some sample adminSection
		var admins = [
			{privilege: "5", username: "Yolo598", password: "password"}
		];
		for(var i in admins){
			db.models.AdminSection(admins[i]).save();
			console.log('456');
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
