var async = require('../api/node_modules/async');
var db = require('../api/models/catalog');

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
		// delete all existing textSections
		db.models.TextSection.remove({}, function(){
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
		callback(); // we're done. go to the next function
	},
	function(callback){
		// keep adding more functions baby...
		callback();
	}
], function() {
	console.log("Ok I'm done.");
});
