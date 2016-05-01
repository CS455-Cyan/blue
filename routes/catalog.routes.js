/***																					***\

	Filename: routes/catalog.js
	Authors:
			Tyler Yasaka
			Andrew Fisher
			Kaitlin Snyder
			John Batson

\***																					***/

// housekeeping
var globals = require('./global');
var modules = globals.modules;
var router = modules.express.Router();
var multer = require('multer');

var publicAPI = require('./catalog/public');
var primaryAPI = require('./catalog/primary');
var secondaryAPI = require('./catalog/secondary');

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

/*	Get Text Sections	*/
router.get
(
	'/catalog/textSections',
	publicAPI.getTextSections
);

/*	Get Text Sections By Id	*/
router.get
(
	'/catalog/textSections/:id',
	publicAPI.getTextSectionsById
);

/*	List The General Requirements	*/
router.get
(
	'/catalog/generalRequirements',
	publicAPI.listGeneralRequirements
);

/*	List Program Categories	*/
router.get
(
	'/catalog/programs/categories',
	publicAPI.listProgramCategories
);

/*	View Category Details	*/
router.get
(
	'/catalog/programs/categories/:category',
	publicAPI.viewCategoryDetails
);

/*	View Departments	*/
router.get
(
	'/catalog/programs/categories/:category/departments/:department',
	publicAPI.viewDepartment
);

/*	Search Programs	*/
router.post
(
	'/catalog/programs/search/',
	publicAPI.searchPrograms
);

/*	View Programs In Category	*/
router.get
(
	'/catalog/programs/categories/:category/programs/:program',
	publicAPI.viewProgramsInCategory
);

/*	View Programs In Departments	*/
router.get
(
	'/catalog/programs/categories/:category/departments/:department/programs/:program',
	publicAPI.viewProgramsInDepartment
);

/*	List Courses	*/
router.get
(
	'/catalog/courses',
	publicAPI.listCourses
);

/*	View Courses	*/
router.get
(
	'/catalog/courses/:id',
	publicAPI.viewCourses
);

/*	Search Courses	*/
router.post
(
	'/catalog/courses/search/',
	publicAPI.searchCourses
);

/*	List Subjects	*/
router.get
(
	'/catalog/subjects',
	publicAPI.listSubjects
);

/*	View subject and list courses for subject	*/
router.get
(
	'/catalog/subjects/:id',
	publicAPI.listCoursesForSubject
);

/*	Get Faculty And Staff	*/
router.get
(
	'/catalog/facultyAndStaff',
	publicAPI.getFacultyAndStaff
);

/*	List archived PDFs	*/
router.get
(
	'/catalog/archives',
	publicAPI.listArchivedPDFs
);

/*--																					--*\
						PRIMARY ADMIN API ROUTES
\*--																					--*/

/* Add Text Section */
router.post
(
	'/admin/catalog/textSections',
	primaryAPI.addTextSection
);

/* Reorder Text Sections */
router.put
(
	'/admin/catalog/textSectionsOrder',
	primaryAPI.reorderTextSections
);

/* Update Text Section */
router.put
(
	'/admin/catalog/textSections/:id',
	primaryAPI.updateTextSection
);

/* Remove Text Section */
router.delete
(
	'/admin/catalog/textSections/:id',
	primaryAPI.removeTextSection
);

/* Add Requirement to Area */
router.post
(
	'/admin/catalog/generalRequirements/:area',
	primaryAPI.addRequirementToArea
);

/* Update Requirement in Area */
router.put
(
	'/admin/catalog/generalRequirements/:area/:requirement',
	primaryAPI.updateRequirementInArea
);

/* Remove General Requirement from Area */
router.delete
(
	'/admin/catalog/generalRequirements/:area/:requirement',
	primaryAPI.removeGeneralRequirementFromArea
);

/* Add Category */
router.post
(
	'/admin/catalog/programs/categories',
	primaryAPI.addCategory
);

/* Update Category */
router.put
(
	'/admin/catalog/programs/categories/:category',
	primaryAPI.updateCategory
);

/* Remove Category */
router.delete
(
	'/admin/catalog/programs/categories/:category',
	primaryAPI.removeCategory
);

/* Add Department */
router.post
(
	'/admin/catalog/programs/categories/:category/departments',
	primaryAPI.addDepartment
);

/* Update Department */
router.put
(
	'/admin/catalog/programs/categories/:category/departments/:department',
	primaryAPI.updateDepartment
);

/* Remove Department */
router.delete
(
	'/admin/catalog/programs/categories/:category/departments/:department',
	primaryAPI.removeDepartment
);

/* Add Program to Category */
router.post
(
	'/admin/catalog/programs/categories/:category/programs',
	primaryAPI.addProgramToCategory
);

/* Add Program to Department */
router.post
(
	'/admin/catalog/programs/categories/:category/departments/:department/programs',
	primaryAPI.addProgramToDepartment
);

/* Update Program in Category */
router.put
(
	'/admin/catalog/programs/categoies/:category/programs/:program',
	primaryAPI.updateProgramInCategory
);

/* Update Program in Department */
router.put
(
	'/admin/catalog/programs/categories/:category/departments/:department/programs/:program',
	primaryAPI.updateProgramInDepartment
);

/* Remove Program from Category */
router.delete
(
	'/admin/catalog/programs/categories/:category/programs/:program',
	primaryAPI.removeProgramFromCategory
);

/* Remove Program from Department */
router.delete
(
	'/admin/catalog/programs/categories/:category/departments/:department/programs/:program',
	primaryAPI.removeProgramFromDepartment
);

/* Add Course Subject */
router.post
(
	'/admin/catalog/subjects',
	primaryAPI.addCourseSubject
);

/* Update Course Subject */
router.put
(
	'/admin/catalog/subjects/:id',
	primaryAPI.updateCourseSubject
);

/* Remove Course Subject */
router.delete
(
	'/admin/catalog/subjects/:id',
	primaryAPI.removeCourseSubject
);

/* Add Course */
router.post
(
	'/admin/catalog/courses',
	primaryAPI.addCourse
);

/* Update Course */
router.put
(
	'/admin/catalog/courses/:id',
	primaryAPI.updateCourse
);

/* Remove Course */
router.delete
(
	'/admin/catalog/courses/:id',
	primaryAPI.removeCourse
);

/* Update Faculty and Staff */
router.put
(
	'/admin/catalog/facultyAndStaff',
	primaryAPI.updateFacultyAndStaff
);

/* Update Faculty and Staff */
router.post
(
	'/admin/catalog/publish',
	primaryAPI.publishCatalog
);

/* View Change Request Queue */
router.get
(
	'/admin/changeRequests/queue',
	primaryAPI.viewChangeRequestQueue
);

/* Approve Change Request */
router.put
(
	'/admin/changeRequests/approve/:id',
	primaryAPI.approveChangeRequest
);

/* Deny Change Request */
router.put
(
	'/admin/changeRequests/deny/:id',
	primaryAPI.denyChangeRequest
);

/* Add Secondary Admin */
router.post
(
	'/admin/admins',
	primaryAPI.addAdmin
);


/* Remove Secondary Admin */
router.delete
(
	'/admin/admins/:id',
	primaryAPI.removeAdmin
);

/* Change Password of Admin*/
router.put
(
	'/admin/password/:id',
	primaryAPI.changePasswordAdmin
);

/* View Admins */
router.get
(
	'/admin/admins',
	primaryAPI.viewAdmins
);


/*--																					--*\
						SECONDARY ADMIN API ROUTES
\*--																					--*/

/* Change Password*/
router.put
(
	'/admin/password',
	secondaryAPI.changePassword
);

/* View Change Requests (created by that admin) */
router.get
(
	'/admin/changeRequests/userRequests',
	secondaryAPI.viewChangeRequests
);

/* Create Change Request */
router.post
(
	'/admin/changeRequests/userRequests',
	upload.single('file'),
	secondaryAPI.createChangeRequest
);

/* Edit Change Request */
router.put
(
	'/admin/changeRequests/userRequests/:id',
	secondaryAPI.editChangeRequest
);

/* Remove Change Request */
router.delete
(
	'/admin/changeRequests/userRequests/:id',
	secondaryAPI.removeChangeRequest
);

/* View Change Log */
router.get
(
	'/admin/changeRequests/log',
	secondaryAPI.viewChangeLog
);

// export these routes to the main router
module.exports = router;
