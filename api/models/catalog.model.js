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


// generalRequirements
var generalRequirementsSchema = mongoose.Schema({
	areaI: [{
		requirements: [{
			name: String,
			courseList: {
				items: {
					separator: Boolean,
					courses: String,
					write_in: String
				},
			}
		}]
	}],
	areaII: [{
		requirements: [{
			name: String,
			courseList: {
				items: {
					separator: Boolean,
					courses: String,
					write_in: String
				},
			}
		}]
	}],
	areaIII: [{
		requirements: [{
			name: String,
			courseList: {
				items: {
					separator: Boolean,
					courses: String,
					write_in: String
				},
			}
		}]
	}],
	areaIV: [{
		requirements: [{
			name: String,
			courseList: {
				items: {
					separator: Boolean,
					courses: String,
					write_in: String
				},
			}
		}]
	}],
	areaV: [{
		requirements: [{
			name: String,
			courseList: {
				items: {
					separator: Boolean,
					courses: String,
					write_in: String
				},
			}
		}]
	}]
});
models.GeneralRequirements = mongoose.model('GeneralRequirements', generalRequirementsSchema);


// programSections
var programSectionSchema = mongoose.Schema({
	categories: [{
		name: String,
		description: String,
		departments: [{
			name: String,
			description: String,
			programs: [{
				type: String,
				name: String,
				description: String
			}],
		}],
		programs: [{
			type: String,
			name: String,
			description: String
		}],
	}],
});
models.ProgramSection = mongoose.model('ProgramSection', programSectionSchema);

// courseSections
var courseSectionSchema = mongoose.Schema({
	subjects: {
		name: String,
		abbreviation: String,
		courses: {
			title: String,
			number: String,
			description: String
		}
	}
});
models.CourseSection = mongoose.model('CourseSection', courseSectionSchema);

// changeRequests
var changeRequestsSchema = mongoose.Schema({
	author: String,
	timeOfRequest: String,
	timeOfApproval: String,
	status: String
});
models.ChangeRequests = mongoose.model('ChangeRequests', changeRequestsSchema);

// adminSections
var adminSectionSchema = mongoose.Schema({
	privilege: Number,
	username: String,
	password: String
});
models.AdminSection = mongoose.model('AdminSection', adminSectionSchema);


// export the models object for inclusion in other scripts
module.exports = {
	mongoose: mongoose,
	models: models
};
