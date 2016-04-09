/***																					***\

	Filename: api/models/catalog.model.js
	Authors: Tyler Yasaka
	         Andrew Fisher

\***																					***/

var mongoose = require('mongoose');

var models = {};

// admins
var adminSchema = mongoose.Schema({
	username: String,
	password: String,
	privilege: Number,
	apps: [String]
});
models.Admin = mongoose.model('Admin', adminSchema);

// textSections
var textSectionSchema = mongoose.Schema({
	title: String,
	content: String
});
models.TextSection = mongoose.model('TextSection', textSectionSchema);

// requirement schema
var requirementSchema = mongoose.Schema({
	name: String,
	items: [{
		separator: String,
		courses: [],
		write_in: String
	}]
});

// generalRequirements
var generalRequirementsSchema = mongoose.Schema({
	areaI: [{
		name: String,
		requirements: [requirementSchema]
	}],
	areaII: [{
		name: String,
		requirements: [requirementSchema]
	}],
	areaIII: [{
		name: String,
		requirements: [requirementSchema]
	}],
	areaIV: [{
		name: String,
		requirements: [requirementSchema]
	}],
	areaV: [{
		name: String,
		requirements: [requirementSchema]
	}]
});
models.GeneralRequirement = mongoose.model('GeneralRequirement', generalRequirementsSchema);

var programSchema = mongoose.Schema({
	type: String,
	name: String,
	description: String,
	requirements: [requirementSchema]
});

// programs
var programSectionSchema = mongoose.Schema({
	categories: [{
		name: String,
		description: String,
		departments: [{
			name: String,
			description: String,
			programs: [programSchema]
		}],
		programs: [programSchema]
	}]
}, { typeKey: '$type' });
models.Program = mongoose.model('Program', programSectionSchema);

// courses
var courseSchema = mongoose.Schema({
	subjects: [{
		name: String,
		abbreviation: String,
		courses: [{
			title: String,
			number: String,
			description: String
		}]
	}]
});
models.Course = mongoose.model('Course', courseSchema);

// changeRequests
var changeRequestsSchema = mongoose.Schema({
	author: String,
	timeOfRequest: String,
	timeOfApproval: String,
	status: String
});
models.ChangeRequest = mongoose.model('ChangeRequest', changeRequestsSchema);

// export the models object for inclusion in other scripts
module.exports = {
	mongoose: mongoose,
	models: models
};
