/***																					***\

	Filename: scripts/unknown.js
	Authors:
			Tyler Yasaka
			Andrew Fisher

\***																					***/

var definitions = require('../routes/catalog/definitions');
var async = require('../node_modules/async');

async.waterfall([
	function(callback){
		definitions.copyCollection('TextSection', callback);
	},
	function(callback){
		definitions.copyCollection('GeneralRequirement', callback);
	},
	function(callback){
		definitions.copyCollection('Program', callback);
	},
	function(callback){
		definitions.copyCollection('Course', callback);
	},
	function(callback){
		definitions.copyCollection('FacultyAndStaff', callback);
	}
]);