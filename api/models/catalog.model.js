/***																					***\

	Filename: api/models/catalog.model.js
	Authors:
			Tyler Yasaka
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
	sections: [{
		title: String,
		content: String
	}]
});
models.TextSection = mongoose.model('TextSection', textSectionSchema);

// requirement schema
var requirementSchema = mongoose.Schema({
	name: String,
	items: [{
		separator: String,
		courses: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Course'
		}],
		writeIn: {
			content: String,
			hours: {
				min: Number,
				max: Number
			}
		},
		credit: String
	}],
	credit: String
});

// generalRequirements
var generalRequirementsSchema = mongoose.Schema({
	area: String,
	name: String,
	requirements: [requirementSchema]
});
models.GeneralRequirement = mongoose.model('GeneralRequirement', generalRequirementsSchema);

// programs
var programSchema = mongoose.Schema({
	type: String,
	name: String,
	description: String,
	requirements: [requirementSchema]
});
var programSectionSchema = mongoose.Schema({
	name: String,
	description: String,
	departments: [{
		name: String,
		description: String,
		programs: [programSchema]
	}],
	programs: [programSchema]
}, { typeKey: '$type' });
models.Program = mongoose.model('Program', programSectionSchema);

// subjects
var subjectSchema = mongoose.Schema({
	name: String,
	abbreviation: String
});
models.Subject = mongoose.model('Subject', subjectSchema);

// courses
var courseSchema = mongoose.Schema({
	title: String,
	description: String,
	number: String,
	offerings: [String],
	hours: {
		min: Number,
		max: Number
	},
	fee: String,
	subject: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Subject'
	}
});
models.Course = mongoose.model('Course', courseSchema);

// facultyAndStaff
var facultyAndStaffSchema = mongoose.Schema({
	content: String
});
models.FacultyAndStaff = mongoose.model('FacultyAndStaff', facultyAndStaffSchema);

// changeRequests
var changeRequestSchema = mongoose.Schema({
	author: String, // the admin that made the request; usually will be secondary admin
	timeOfRequest: Date,
	timeOfApproval: Date,
	status: String, // "pending", "approved", or "denied"; can only be changed by primary admin
	requestTypes: [],
	newCourseInfo: {
		syllabusFile: String, // will be name in filesystem of uploaded file
		title: String,
		name: String,
		description: String,
		number: String,
		hours: String,
		fee: String,
		prerequisitesCorequisites: String,
		offerings: []
	},
	revisedFacultyCredentials: {
		needed: Boolean,
		content: String
	},
	courseListChange: {
		needed: Boolean,
		content: String
	},
	effective: {
		semester: String,
		year: String
	},
	courseFeeChange: String,
	affectedDepartmentsPrograms: String,
	approvedBy: String, // this is for the requester to enter; not referring to the primary admin approval
	description: String, // generic description field for requester to describe the change,
	comment: String // comment made by primary admin on approval/denial
});
models.ChangeRequest = mongoose.model('ChangeRequest', changeRequestSchema);

// export the models object for inclusion in other scripts
module.exports = {
	mongoose: mongoose,
	models: models
};
