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
			description: String,
			number: String,
			offerings: [String],
			hours: String,
			fee: Number
		}]
	}]
});
models.Course = mongoose.model('Course', courseSchema);

// facultyAndStaff
var facultyAndStaffSchema = mongoose.Schema({
	content: String
});
models.FacultyAndStaff = mongoose.model('FacultyAndStaff', facultyAndStaffSchema);

// changeRequests
var changeRequestSchema = mongoose.Schema({
	author: String,
	timeOfRequest: Date,
	timeOfApproval: Date,
	status: String
});
models.ChangeRequest = mongoose.model('ChangeRequest', changeRequestSchema);

// export the models object for inclusion in other scripts
module.exports = {
	mongoose: mongoose,
	models: models
};
