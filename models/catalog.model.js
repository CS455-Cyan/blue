/***																					***\

	Filename: models/catalog.model.js
	Authors:
			Tyler Yasaka
			Andrew Fisher

\***																					***/

var mongoose = require('mongoose');
var events = require('events');

var connectionEmitter = new events.EventEmitter();

var connection = {
	admin: mongoose.createConnection('mongodb://cyan:8029df8b@ds035603.mongolab.com:35603/apps'),
	public: mongoose.createConnection('mongodb://cyan:8029df8b@ds019471.mlab.com:19471/catalogpublic')
}

connection.admin.once('open', function() {
	console.log('Connected to admin database');
	connectionEmitter.emit('admin');
});
connection.public.once('open', function() {
	console.log('Connected to public database');
	connectionEmitter.emit('public');
});

var models = {};
var publicModels = {};

// admins
var adminSchema = mongoose.Schema({
	username: String,
	password: String,
	privilege: Number,
	apps: [String]
});
models.Admin = connection.admin.model('Admin', adminSchema);

// textSections
var textSectionSchema = mongoose.Schema({
	sections: [{
		title: String,
		content: String
	}]
});
models.TextSection = connection.admin.model('TextSection', textSectionSchema);
publicModels.TextSection = connection.public.model('TextSection', textSectionSchema);

// requirement schema
var requirementSchema = mongoose.Schema({
	name: String,
	separator: String,
	items: [{
		separator: String,
		courses: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Course'
		}],
		isWriteIn: Boolean,
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
models.GeneralRequirement = connection.admin.model('GeneralRequirement', generalRequirementsSchema);
publicModels.GeneralRequirement = connection.public.model('GeneralRequirement', generalRequirementsSchema);

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
models.Program = connection.admin.model('Program', programSectionSchema);
publicModels.Program = connection.public.model('Program', programSectionSchema);

// subjects
var subjectSchema = mongoose.Schema({
	name: String,
	abbreviation: String
});
models.Subject = connection.admin.model('Subject', subjectSchema);
publicModels.Subject = connection.public.model('Subject', subjectSchema);

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
models.Course = connection.admin.model('Course', courseSchema);
publicModels.Course = connection.public.model('Course', courseSchema);

// facultyAndStaff
var facultyAndStaffSchema = mongoose.Schema({
	content: String
});
models.FacultyAndStaff = connection.admin.model('FacultyAndStaff', facultyAndStaffSchema);
publicModels.FacultyAndStaff = connection.public.model('FacultyAndStaff', facultyAndStaffSchema);

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
models.ChangeRequest = connection.admin.model('ChangeRequest', changeRequestSchema);

// catalogYears
var catalogYearSchema = mongoose.Schema({
	beginYear: String,
	endYear: String
});
models.CatalogYear = connection.admin.model('CatalogYear', catalogYearSchema);

// export the models object for inclusion in other scripts
module.exports = {
	models: models,
	publicModels: publicModels,
	connection: connectionEmitter
};
