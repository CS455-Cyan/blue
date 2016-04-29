/***																					***\

	Filename: api/routes/catalog.js
	Authors:
			Tyler Yasaka
			Andrew Fisher
			Kaitlin Snyder
			John Batson

\***																					***/

// housekeeping
var globals = require('./global');
var modules = globals.modules;
var db = require('../models/catalog.model');
var isAuthenticated = globals.isAuthenticated;
var router = modules.express.Router();
var primaryAPI = require('./primary');
var secondaryAPI = require('./secondary');
var multer = require('multer');
var definitions = require('./definitions');
var privilege = definitions.privilege;

var publicAPI = require('./public');

var fileStorage = modules.multer.diskStorage({
	destination: function(req, file, cb)
	{
	  cb(null, __dirname + '/../uploads/catalog')
	},
	filename: function(req, file, cb)
	{
		cb(null, Date.now() + '-' + file.originalname);
	}
});

var upload = multer({ storage: fileStorage });

/*--																					--*\
								PUBLIC API ROUTES
\*--																					--*/

/*
	Route: List textSections
	Input:
	Output:
		{"success": Boolean, data: ["_id": String, "title": String]}
	Created: 03/24/2016 Tyler Yasaka
	Modified:
*/
router.get
(
	'/catalog/textSections',
	publicAPI.getTextSections
);

/*
	Route: Get textSection
	Input:
		url parameters:
			id: id of textSection
	Output:
		{"success": Boolean, data: {"_id": String, "title": String, "content": String}}
	Created: 03/24/2016 Tyler Yasaka
	Modified:
*/
router.get
(
	'/catalog/textSections/:id',
	publicAPI.getTextSectionsById
);

/*
	Route: List generalRequirements
	Input:
	Output:
		{"success": Boolean, data: [
			{
				"_id": String,
				"area": String,
				name": String,
				"requirements": []
			}
		]}
	Created: 04/02/2016 Andrew Fisher
	Modified:
		04/17/2016 Tyler Yasaka
		04/19/2016 Tyler Yasaka
*/
router.get
(
	'/catalog/generalRequirements',
	publicAPI.listGeneralRequirements
);

/*
	Route: List program categories
	Input:
	Output:
		{"success": Boolean, data: [
			{
				"_id": String,
				"name": String,
			}
		]}
	Created: 04/02/2016 Andrew Fisher
	Modified:
		04/08/2016 Tyler Yasaka
		04/17/2016 Tyler Yasaka
*/
router.get
(
	'/catalog/programs/categories',
	publicAPI.listProgramCategories
);

/*
	Route: View category details
	Input:
		url parameters:
			category: id of category
	Output:
		{"success": Boolean, data: {
			"_id": String,
			"name": String,
			"description": String,
			"programs": [],
			"departments": [{
				"_id": String,
				"name": String,
				"description: String,
				"programs": []
			}]
		}}
	Created: 04/02/2016 Andrew Fisher
	Modified:
		04/08/2016 Tyler Yasaka
		04/17/2016 Tyler Yasaka
*/
router.get
(
	'/catalog/programs/categories/:category',
	publicAPI.viewCategoryDetails
);

/*
	Route: View department
	Input:
		url parameters:
			category: id of category
			department: id of department
	Output:
		{"success": Boolean, data: {
			"department": {
				"_id": String,
				"name": String,
				"description": String
			},
			"category": {
				"_id": String,
				"name": String
			}
		}}
	Created: 04/19/2016 Tyler Yasaka
	Modified:
*/
router.get
(
	'/catalog/programs/categories/:category/departments/:department',
	publicAPI.viewDepartment
);

/*
	Route: Search programs
	Input:
		payload: {"term": String}
	Output:
		{"success": Boolean, data: [
			{
				"_id": String,
				"type": String,
				"name": String,
				"description": String,
				"requirements": []
			}
		]}
	Created: 04/16/2016 Andrew Fisher
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.post
(
	'/catalog/programs/search/',
	publicAPI.searchPrograms
);

/*
	Route: View program in category
	Input:
		url parameters:
			category: id of category
			program: id of program
	Output:
		{"success": Boolean, data: {
			"program": {
				"_id": String,
				"type": String,
				"name": String,
				"description": String,
				"requirements": []
			},
			"category": {
				"_id": String,
				"name": String
			}
		}}
	Created: 04/17/2016 Tyler Yasaka
	Modified: 04/19/2016 Tyler Yasaka
*/
router.get
(
	'/catalog/programs/categories/:category/programs/:program',
	publicAPI.viewProgramsInCategory
);

/*
	Route: View program in department
	Input:
		url parameters:
			category: id of categoryt
			department: id of departmen
			program: id of program
	Output:
		{"success": Boolean, data: {
			"program": {
				"_id": String,
				"type": String,
				"name": String,
				"description": String,
				"requirements": []
			},
			"category": {
				"_id": String,
				"name": String
			},
			"department": {
				"_id": String,
				"name": String
			}
		}}
	Created: 04/17/2016 Tyler Yasaka
	Modified:
*/
router.get
(
	'/catalog/programs/categories/:category/departments/:department/programs/:program',
	publicAPI.viewProgramsInDepartment
);

/*
	Route: List courses
	Input:
	Output:
		{"success": Boolean, data: [{
			"_id": String,
			"title": String
			"number": String,
			"description": String,
			"offerings": [],
			"subject": {
				"_id": String,
				"name": String,
				"abbreviation": String
			}
		}]}
	Created: 04/02/2016 Andrew Fisher
	Modified:
		04/08/2016 Tyler Yasaka
		04/17/2016 Tyler Yasaka
*/
router.get
(
	'/catalog/courses',
	publicAPI.listCourses
);

/*
	Route: View Course
	Input:
		url parameters:
			id: id of course
	Output:
		{"success": Boolean, data: {
			"_id": String,
			"title": String
			"number": String,
			"description": String,
			"offerings": [],
			"subject": {
				"_id": String,
				"name": String,
				"abbreviation": String
			}
		}}
	Created: 04/17/2016 Tyler Yasaka
	Modified:
*/
router.get
(
	'/catalog/courses/:id',
	publicAPI.viewCourses
);

/*
	Route: Search courses
	Input:
		payload: {"term": String}
	Output:
		{"success": Boolean, data: [
			{
				"_id": String,
				"title": String,
				"number": String,
				"description": String,
				"offerings": []
			}
		]}
	Created: 04/16/2016 Andrew Fisher
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.post
(
	'/catalog/courses/search/',
	publicAPI.searchCourses
);

/*
	Route: List subjects
	Input:
	Output:
		{"success": Boolean, data: [{
			"_id": String,
			"name": String
			"abbreviation": String
		}]}
	Created: 04/17/2016 Tyler Yasaka
	Modified:
*/
router.get
(
	'/catalog/subjects',
	publicAPI.listSubjects
);

/*
	Route: View subject and list courses for subject
	Input:
		url parameters:
			id: id of subject
	Output:
	{"success": Boolean, data: {
		"subject": {
			"_id": String,
			"name": String
			"abbreviation": String,
		},
		"courses": [{
			"_id": String,
			"title": String
			"number": String,
			"description": String,
			"offerings": []
		}]
	}}
	Created: 04/17/2016 Tyler Yasaka
	Modified:
*/
router.get
(
	'/catalog/subjects/:id',
	publicAPI.listCoursesForSubject
);

/*
	Route: Get facultyAndStaff
	Input:
	Output:
		{"success": Boolean, data:  String}
	Created: 04/11/2016 Tyler Yasaka
	Modified:
*/
router.get
(
	'/catalog/facultyAndStaff',
	publicAPI.getFacultyAndStaff
);

/*--																					--*\
						PRIMARY ADMIN API ROUTES
\*--																					--*/

/*
	Route: Add textSection
	Input:
		payload: {"title": String, "content": String}
	Output:
		{"success": Boolean}
	Created: 03/24/2016 Tyler Yasaka
	Modified:
*/
router.post
(
	'/admin/catalog/textSections',
	primaryAPI.addTextSection
);

/*
	Route: Re-order text sections
	Input:
		payload: [
			{"_id": "12345"},
			{"_id": "67890"},
			{"_id": "34567"}
		]
	Output:
		{"success": Boolean}
	Created: 04/24/2016 Tyler Yasaka
	Modified:
*/
router.put
(
	'/admin/catalog/textSectionsOrder',
	primaryAPI.reorderTextSections
);

/*
	Route: Update textSection
	Input:
		url parameters:
			id: id of textSection
		payload: {"title": String, "content": String}
	Output:
		{"success": Boolean}
	Created: 03/24/2016 Tyler Yasaka
	Modified:
*/
router.put
(
	'/admin/catalog/textSections/:id',
	primaryAPI.updateTextSection
);

/*
	Route: Remove textSection
	Input:
		url parameters:
			id: id of textSection
	Output:
		{"success": Boolean}
	Created: 03/24/2016 Tyler Yasaka
	Modified:
*/
router.delete
(
	'/admin/catalog/textSections/:id',
	primaryAPI.removeTextSection
);

/*
	Route: Add requirement to area
	Input:
		url parameters:
			area: id of area to add program to
		payload: {"name": String, "items": []}
	Output:
		{"success": Boolean}
	Created: 04/16/2016 John Batson
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.post
(
	'/admin/catalog/generalRequirements/:area',
	primaryAPI.addRequirementToArea
);

/*
	Route: Update requirement in area
	Input:
		url parameters:
			area: id of area containing requirement
			requirement: id of requirement
		payload: {"name": String, "items": []}
	Output:
		{"success": Boolean}
	Created: 04/16/2016 John Batson
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.put
(
	'/admin/catalog/generalRequirements/:area/:requirement',
	primaryAPI.updateRequirementInArea
);

/*
	Route: Remove general requirement from area
	Input:
		url parameters:
			area: id of area containing requirement
			requirement: id of requirement
	Output:
		{"success": Boolean}
	Created: 04/16/2016 John Batson
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.delete
(
	'/admin/catalog/generalRequirements/:area/:requirement',
	primaryAPI.removeGeneralRequirementFromArea
);

/*
	Route: Add category
	Input:
		payload: {"name": String, "description": String, "departments": [], "programs": []}
	Output:
		{"success": Boolean}
	Created: 04/15/2016 Kaitlin Snyder
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.post
(
	'/admin/catalog/programs/categories',
	primaryAPI.addCategory
);

/*
	Route: Update category
	Input:
		url parameters:
			category: id of category to update
		payload: {"name": String, "description": String, "departments": [], "programs": []}
	Output:
		{"success": Boolean}
	Created: 04/15/2016 Kaitlin Snyder
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.put
(
	'/admin/catalog/programs/categories/:category',
	primaryAPI.updateCategory
);

/*
	Route: Remove category
	Input:
		url parameters:
			category: id of category to update
	Output:
		{"success": Boolean}
	Created: 04/15/2016 Kaitlin Snyder
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.delete
(
	'/admin/catalog/programs/categories/:category',
	primaryAPI.removeCategory
);

/*
	Route: Add department
	Input:
		url parameters:
			category: id of category to add department to
		payload: {"name": String, "description": String, "programs": []}
	Output:
		{"success": Boolean}
	Created: 04/9/2016 Tyler Yasaka
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.post
(
	'/admin/catalog/programs/categories/:category/departments',
	primaryAPI.addDepartment
);

/*
	Route: Update department
	Input:
		url parameters:
			category: id of category that department is in
			department: id of department
		payload: {"name": String, "description": String, "programs": []}
	Output:
		{"success": Boolean}
	Created: 04/9/2016 Tyler Yasaka
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.put
(
	'/admin/catalog/programs/categories/:category/departments/:department',
	primaryAPI.updateDepartment
);

/*
	Route: Remove department
	Input:
		url parameters:
			category: id of category that department is in
			department: id of department
	Output:
		{"success": Boolean}
	Created: 04/9/2016 Tyler Yasaka
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.delete
(
	'/admin/catalog/programs/categories/:category/departments/:department',
	primaryAPI.removeDepartment
);

/*
	Route: Add program to category
	Input:
		url parameters:
			category: id of category to add program to
		payload: {"type": String, "name": String, "description": String, requirements: []}
	Output:
		{"success": Boolean}
	Created: 04/11/2016 Tyler Yasaka
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.post
(
	'/admin/catalog/programs/categories/:category/programs',
	primaryAPI.addProgramToCategory
);

/*
	Route: Add program to department
	Input:
		url parameters:
			category: id of category containing department
			department: id of department to add program to
		payload: {"type": String, "name": String, "description": String, requirements: []}
	Output:
		{"success": Boolean}
	Created: 04/11/2016 Tyler Yasaka
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.post
(
	'/admin/catalog/programs/categories/:category/departments/:department/programs',
	primaryAPI.addProgramToDepartment
);

/*
	Route: Update program in category
	Input:
		url parameters:
			category: id of category containing department
			program: id of program
		payload: {"type": String, "name": String, "description": String, requirements: []}
	Output:
		{"success": Boolean}
	Created: 04/11/2016 Tyler Yasaka
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.put
(
	'/admin/catalog/programs/categoies/:category/programs/:program',
	primaryAPI.updateProgramInCategory
);

/*
	Route: Update program in department
	Input:
		url parameters:
			category: id of category containing department
			department: id of department containing program
			program: id of program
		payload: {"type": String, "name": String, "description": String, requirements: []}
	Output:
		{"success": Boolean}
	Created: 04/11/2016 Tyler Yasaka
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.put
(
	'/admin/catalog/programs/categories/:category/departments/:department/programs/:program',
	primaryAPI.updateProgramInDepartment
);

 /*
	Route: Remove program from category
	Input:
		url parameters:
			category: id of category containing program
			program: id of program
	Output:
		{"success": Boolean}
	Created: 04/11/2016 Tyler Yasaka
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.delete
(
	'/admin/catalog/programs/categories/:category/programs/:program',
	primaryAPI.removeProgramFromCategory
);

/*
	Route: Remove program from department
	Input:
		url parameters:
			category: id of category containing department
			department: id of department containing program
			program: id of program
	Output:
		{"success": Boolean}
	Created: 04/11/2016 Tyler Yasaka
	Modified:
		04/17/2016 Tyler Yasaka
*/
router.delete
(
	'/admin/catalog/programs/categories/:category/departments:department/programs/:program',
	primaryAPI.removeProgramFromDepartment
);

/*
	Route: Add course subject
	Input:
		payload: {"title": String, "abbreviation": String}
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Kaitlin Snyder
	Modified:

*/
router.post
(
	'/admin/catalog/subjects',
	primaryAPI.addCourseSubject
);


/*
	Route: Update course subject
	Input:
		url parameters:
			id: id of subject
		payload: {"title": String, "abbreviation": String}
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Kaitlin Snyder
	Modified:

*/
router.put
(
	'/admin/catalog/subjects/:id',
	primaryAPI.updateCourseSubject
);

/*
	Route: Remove course subject
	Input:
		url parameters:
			id: id of subject
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Kaitlin Snyder
	Modified:
*/
router.delete
(
	'/admin/catalog/subjects/:id',
	primaryAPI.removeCourseSubject
);

/*
	Route: Add course
	Input:
		payload: {"title": String, "description": String, "number": String, "offerings": [],
				  "hours": {"min": String, "max": String}, "fee": String, "subject": {}}
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Kaitlin Snyder
	Modified:

*/
router.post
(
	'/admin/catalog/courses',
	primaryAPI.addCourse
);

/*
	Route: Update course
	Input:
		url parameters:
			id: id of course
		payload: {"title": String, "description": String, "number": String, "offerings": [],
				  "hours": {"min": String, "max": String}, "fee": String, "subject": {}}
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Kaitlin Snyder
	Modified:

*/
router.put
(
	'/admin/catalog/courses/:id',
	primaryAPI.updateCourse
);

/*
	Route: Remove course
	Input:
		url parameters:
			id: id of course
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Kaitlin Snyder
	Modified:
*/
router.delete
(
	'/admin/catalog/courses/:id',
	primaryAPI.removeCourse
);


 /*
	Route: Update facultyAndStaff
	Input:
		payload: {"content": String}
	Output:
		{"success": Boolean}
	Created: 04/11/2016 Tyler Yasaka
	Modified:
*/
router.put
(
	'/admin/catalog/facultyAndStaff',
	primaryAPI.updateFacultyAndStaff
);

/*
	Route: Change password
	Input:
		payload: {"password": String}
	Output:

	Created: 04/24/2016 Andrew Fisher
	Modified:
 */
router.put
(
	'/admin/password',
	primaryAPI.changePassword
);

/*
	Route: View change requests (created by that admin)
	Input:
	Output:
		{"success": Boolean,
		 "data": {
			"_id": String,
			"author": String,
			"timeOfRequest": Date,
			"timeOfApproval": Date,
			"status": String,
			"requestTypes": [],
			"newCourseInfo": {
				"syllabusFile": String,
				"title": String,
				"name": String,
				"description": String,
				"number": String,
				"hours": String,
				"fee": String,
				"prerequisitesCorequisites": String,
				"offerings": []
			},
			"revisedFacultyCredentials": {
				"needed": Boolean,
				"content": String
			},
			"courseListChange": {
				"needed": Boolean,
				"content": String
			},
			"effective": {
				"semester": String,
				"year": String
			},
			"courseFeeChange": String,
			"affectedDepartmentsPrograms": String,
			"approvedBy": String,
			"description": String,
			"comment": String
		}}
	Created: 04/24/2016 Andrew Fisher
	Modified:
 */
router.get
(
	'/admin/changeRequests/userRequests',
	secondaryAPI.viewChangeRequests
);

/*
	Route: Create change request
	Input:
		payload: {
			"author": String,
			"timeOfRequest": Date,
			"timeOfApproval": Date,
			"status": String,
			"requestTypes": [],
			"newCourseInfo": {
				"syllabusFile": String,
				"title": String,
				"name": String,
				"description": String,
				"number": String,
				"hours": String,
				"fee": String,
				"prerequisitesCorequisites": String,
				"offerings": []
			},
			"revisedFacultyCredentials": {
				"needed": Boolean,
				"content": String
			},
			"courseListChange": {
				"needed": Boolean,
				"content": String
			},
			"effective": {
				"semester": String,
				"year": String
			},
			"courseFeeChange": String,
			"affectedDepartmentsPrograms": String,
			"approvedBy": String,
			"description": String,
			"comment": String
		}
		file: file
	Output:

	Created: 04/24/2016 Andrew Fisher
	Modified:
 */
router.post
(
	'/admin/changeRequests/userRequests',
	upload.single('file'),
	secondaryAPI.createChangeRequest
);

/*
	Route: Edit change request
	Input:
		payload: {"effective": {
					"semester": String,
					"year": String
					}}
	Output:

	Created: 04/24/2016 Andrew Fisher
	Modified:
 */
router.put
(
	'/admin/changeRequests/userRequests/:id',
	secondaryAPI.editChangeRequest
);

/*
	Route: Remove change request
	Input:
		url parameters:
			id: id of course
	Output:

	Created: 04/24/2016 Andrew Fisher
	Modified:
 */
router.delete
(
	'/admin/changeRequests/userRequests/:id',
	secondaryAPI.removeChangeRequest
);

/*
	Route: View change log
	Input:
	Output:
		{"success": Boolean,
		 "data": {
			"_id": String,
			"author": String,
			"timeOfRequest": Date,
			"timeOfApproval": Date,
			"status": String,
			"requestTypes": [],
			"newCourseInfo": {
				"syllabusFile": String,
				"title": String,
				"name": String,
				"description": String,
				"number": String,
				"hours": String,
				"fee": String,
				"prerequisitesCorequisites": String,
				"offerings": []
			},
			"revisedFacultyCredentials": {
				"needed": Boolean,
				"content": String
			},
			"courseListChange": {
				"needed": Boolean,
				"content": String
			},
			"effective": {
				"semester": String,
				"year": String
			},
			"courseFeeChange": String,
			"affectedDepartmentsPrograms": String,
			"approvedBy": String,
			"description": String,
			"comment": String
		}}
	Created: 04/24/2016 Andrew Fisher
	Modified:
 */
router.get
(
	'/admin/changeRequests/log',
	secondaryAPI.viewChangeLog
);

/*
	Route: View change request queue
	Input:
	Output:
		{"success": Boolean,
		 "data": {
			"_id": String,
			"author": String,
			"timeOfRequest": Date,
			"timeOfApproval": Date,
			"status": String,
			"requestTypes": [],
			"newCourseInfo": {
				"syllabusFile": String,
				"title": String,
				"name": String,
				"description": String,
				"number": String,
				"hours": String,
				"fee": String,
				"prerequisitesCorequisites": String,
				"offerings": []
			},
			"revisedFacultyCredentials": {
				"needed": Boolean,
				"content": String
			},
			"courseListChange": {
				"needed": Boolean,
				"content": String
			},
			"effective": {
				"semester": String,
				"year": String
			},
			"courseFeeChange": String,
			"affectedDepartmentsPrograms": String,
			"approvedBy": String,
			"description": String,
			"comment": String
		}}
	Created: 04/23/2016 John Batson
	Modified:
		04/25/2016 John Batson
 */
router.get
(
	'/admin/changeRequests/queue',
	primaryAPI.viewChangeRequestQueue
);

/*
	Route: Approve change request
	Input:
		url parameters:
			id: id of change request to approve
		payload: {"comment": String}
	Output:
		{"success": Boolean}
	Created: 04/23/2016 John Batson
	Modified:
 */
router.put
(
	'/admin/changeRequests/approve/:id',
	primaryAPI.approveChangeRequest
);

/*
	Route: Deny change request
	Input:
		url parameters:
			id: id of change request to deny
		payload: {"comment": String}
	Output:
		{"success": Boolean}
	Created: 04/23/2016 John Batson
	Modified:
 */
router.put
(
	'/admin/changeRequests/deny/:id',
	primaryAPI.denyChangeRequest
);

 /*
	Route: Add admins
	Input:
		payload: {"username": String, "password": String}
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Andrew Fisher
	Modified:
*/
router.post
(
	'/admin/admins',
	primaryAPI.addAdmin
);

 /*
	Route: Update admins
	Input:
		payload: {"password": String}
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Andrew Fisher
	Modified:
*/
router.put
(
	'/admin/admins/:id',
	primaryAPI.updateAdmin
);

/*
	Route: Remove admins
	Input:
		url parameters:
			id: id of admins
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Andrew Fisher
	Modified:
*/
router.delete
(
	'/admin/admins/:id',
	primaryAPI.removeAdmin
);

/*
	Route: List admins
	Input:
	Output:
		{"success": Boolean, data: [{
			"_id": String,
			"username": String
			"privilege": Number
			"password": String
			"apps": [String]
		}]}
	Created: 04/23/2016 Andrew Fisher
	Modified:
*/
router.get
(
	'/admin/admins',
	primaryAPI.listAdmins
);

/*
	Route: View admins
	Input:
		url parameters:
			id: id of admins
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Andrew Fisher
	Modified:
*/
router.get
(
	'/admin/admins/:id',
	primaryAPI.viewAdmin
);

/*
	Function: selectModels
	Description: select which database models to use for GET requests, based on whether admin is logged in
	Input:
		session: http session object (to check if user is logged in)
	Output:
		the selected database models object (admin or public)
	Created: Tyler Yasaka 04/24/2016
	Modified:
*/
var selectModels = function(session) {
	var models;
	if(session && (session.privilege >= privilege.primaryAdmin)) {
		models = db.models;
	}
	else {
		models = db.publicModels;
	}
	return models;
}

/*
	Function: sortAlphabeticallyByProperty
	Description: Orders objects of an array in alphabetical order of a property
	Input:
		arr: array to sort
		property: property to sort by
	Output:
		sorted array
	Created: Tyler Yasaka 04/17/2016
	Modified:
*/
var sortAlphabeticallyByProperty = function(arr, property) {
	return arr.sort(function(a, b){
		var propertyA=a[property].toLowerCase()
		var propertyB=b[property].toLowerCase();
		if (propertyA < propertyB) //sort string ascending
			return -1;
		if (propertyA > propertyB)
			return 1;
		return 0; //default return value (no sorting)
	});
}

/*
	Function: orderPrograms
	Description: Orders programs by type and then in alphabetical order of program name
	Input:
		programs: array of program objects
	Output:
		sorted array of programs
	Created: Tyler Yasaka 04/17/2016
	Modified:
*/
var orderPrograms = function(programs) {
	var types = {};
	for(var p in programs) {
		var program = programs[p];
		if(typeof types[program.type] == 'undefined') {
			types[program.type] = [];
		}
		types[program.type].push(program);
	}
	var results = [];
	if(types['major']) {
		results = results.concat(
			sortAlphabeticallyByProperty(types['major'], 'name')
		);
		delete types['major'];
	}
	if(types['minor']) {
		results = results.concat(
			sortAlphabeticallyByProperty(types['minor'], 'name')
		);
		delete types['minor']
	}
	if(types['certificate']) {
		results = results.concat(
			sortAlphabeticallyByProperty(types['certificate'], 'name')
		);
		delete types['certificate'];
	}
	for(var t in types) {
		results = results.concat(
			sortAlphabeticallyByProperty(types[t], 'name')
		);
	}
	return results;
}

/*
	Function: formatCredit
	Description: format credit for display based on min and max
	Input:
		hours: hours object with min and max properties
	Output:
		formatted credit (String)
	Created: Tyler Yasaka 04/17/2016
	Modified:
*/
var formatCredit = function(hours) {
	var credit;
	if(hours.min == hours.max) {
		credit = String(hours.min);
	}
	else {
		credit = hours.min + ' - ' + hours.max;
	}
	return credit;
}

/*
	Function: calculateCredit
	Description: Calculate credit for each item in a requirement, as well as the total credit for that requirement
	Input:
		requirements: array of program requirement objects
	Output:
		credit for each item and requirement is stored in requirements object
	Created: Tyler Yasaka 04/17/2016
	Modified:
		04/23/2016 Andrew Fisher
*/
var calculateCredit = function(requirements) {
	for(var r in requirements) {
		var requirement = requirements[r];
		var total = {
			min: 0,
			max: 0
		}
		var orTotal = {
			min: 0,
			max: 0
		}
		for(var i in requirement.items) {
			var item = requirement.items[i];
			var subtotal = {
				min: 0,
				max: 0
			}
			if(item.isWriteIn && !!item.writeIn && !!item.writeIn.hours && typeof item.writeIn.hours.min != 'undefined') {
				subtotal = item.writeIn.hours;
			}
			else if(item.separator == 'AND') {
				for(var c in item.courses) {
					var course = item.courses[c];
					subtotal.min += course.hours.min;
					subtotal.max += course.hours.max;
				}
			}
			else if (item.separator == 'OR' && item.courses.length) {
				subtotal.min = item.courses[0].hours.min;
				subtotal.max = item.courses[0].hours.max;
				for(var c = 1; c < item.courses.length; c++) {
					var course = item.courses[c];
					subtotal.min = Math.min(subtotal.min, course.hours.min);
					subtotal.max = Math.max(subtotal.max, course.hours.max);
				}
			}
			var credit = formatCredit(subtotal);
			total.min += subtotal.min;
			total.max += subtotal.max;

			if(i == 0) {
				orTotal.min = subtotal.min;
			}
			else {
				orTotal.min = Math.min(orTotal.min, subtotal.min);
			}
			orTotal.max = Math.max(orTotal.max, subtotal.max);

			requirements[r].items[i].credit = credit;
		}
		if(requirement.separator == 'AND'){
			var totalCredit = formatCredit(total);
			requirements[r].credit = totalCredit;
		}
		else if(requirement.separator == 'OR'){
			var orTotalCredit = formatCredit(orTotal);
			requirements[r].credit = orTotalCredit;
		}
	}
	return requirements;
}


// export these routes to the main router
module.exports = router;
