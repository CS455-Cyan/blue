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
			{title: "University Information", content: "Mustache sapiente nulla adipisicing qui irure. Blue bottle cred venmo food truck, bitters tofu chicharrones gluten-free lumbersexual locavore."},
			{title: "Academic Procedures", content: "Blah blah blah."}
		];
		for(var i in sections){
			db.models.TextSection(sections[i]).save();
		}
		// create some sample programSections
		var programs = [
			{name: "University Information", description: "Mustache sapiente nulla adipisicing qui irure. Blue bottle cred venmo food truck, bitters tofu chicharrones gluten-free lumbersexual locavore."},
			{name: "Academic Procedures", description: "Blah blah blah."}
		];
		for(var i in programs){
			db.models.ProgramSection(programs[i]).save();
			console.log('asdf');
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
