/***																					***\

	Filename: scripts/initializeDatabase.js
	Authors:
			Tyler Yasaka
			Andrew Fisher

\***																					***/

var async = require('../node_modules/async');
var crypto = require('crypto');
var db = require('../models/catalog.model');

console.log("Alright. One sec...");

// Clear public database
// This can be done asynchronously
db.connection.on('public', function() {
	var cb = function() {};
	db.publicModels.TextSection.remove({}, cb);
	db.publicModels.GeneralRequirement.remove({}, cb);
	db.publicModels.Program.remove({}, cb);
	db.publicModels.Course.remove({}, cb);
	db.publicModels.Subject.remove({}, cb);
	db.publicModels.FacultyAndStaff.remove({}, cb);
	db.publicModels.CatalogYear.remove({}, cb);
});

//Async allows us to simulate asynchronous behavior in javascript. That way these database queries execute one by one, in order.
async.waterfall([
	function(callback){
    //connect to database before trying to interact with it
    db.connection.on('admin', function(){
      callback();
    });
	},
	function(callback){
		// delete all existing textSections
		db.models.TextSection.remove({}, function(){
			callback(); // we're done. go to the next function
		});
	},
	function(callback){
    db.models.GeneralRequirement.remove({}, function(){
			callback(); // we're done. go to the next function
		});
	},
	function(callback){
		db.models.Program.remove({}, function(){
			callback(); // we're done. go to the next function
		});
	},
	function(callback){
    db.models.Subject.remove({}, function(){
			callback(); // we're done. go to the next function
		});
	},
	function(callback){
    db.models.Course.remove({}, function(){
			callback(); // we're done. go to the next function
		});
	},
	function(callback){
    db.models.FacultyAndStaff.remove({}, function(){
			callback(); // we're done. go to the next function
		});
	},
	function(callback){
    db.models.Admin.remove({}, function(){
			callback(); // we're done. go to the next function
		});
	},
	function(callback){
    db.models.ChangeRequest.remove({}, function(){
			callback(); // we're done. go to the next function
		});
	},
	function(callback){
		// create some sample subjects
		var subjects = [
			{
				name: 'Accounting',
				abbreviation: 'AC'
			},
			{
				name: "Art",
				abbreviation: "AR"
			},
			{
				name: 'American Sign Language',
				abbreviation: 'ASL'
			},
			{
				name: "Biology",
				abbreviation: "BI"
			},
			{
				name: "Business Law",
				abbreviation: "BL"
			},
			{
				name: "Chemistry",
				abbreviation: "CH"
			},
			{
				name: "Computer Information Systems",
				abbreviation: "CIS"
			},
			{
				name: "Criminal Justice",
				abbreviation: "CJ"
			},
			{
				name: "Communication",
				abbreviation: "COM"
			},
			{
				name: "Cooperative Education",
				abbreviation: "COM"
			},
			{
				name: "Computer Science",
				abbreviation: "CS"
			},
			{
				name: "Economics",
				abbreviation: "EC"
			},
			{
				name: "Early Childhood Education",
				abbreviation: "ECE"
			},
			{
				name: "Education",
				abbreviation: "ED"
			},
			{
				name: "Elementary Education",
				abbreviation: "EED"
			},
			{
				name: "Special Education",
				abbreviation: "EEX"
			},
			{
				name: "Pre-Engineering",
				abbreviation: "EG"
			},
			{
				name: "English",
				abbreviation: "EN"
			},
			{
				name: "Entertainment Industry",
				abbreviation: "ENT"
			},
			{
				name: "Earth Science",
				abbreviation: "ES"
			},
			{
				name: "Exit Examination",
				abbreviation: "EXIT"
			},
			{
				name: "Finance",
				abbreviation: "FI"
			},
			{
				name: "Foreign Languages",
				abbreviation: "FL"
			},
			{
				name: "French",
				abbreviation: "FR"
			},
			{
				name: "Family Studies",
				abbreviation: "FS"
			},
			{
				name: "First-Year Experience",
				abbreviation: "FYE"
			},
			{
				name: "Geography",
				abbreviation: "GE"
			},
			{
				name: "German",
				abbreviation: "GR"
			}
		];
		db.models.Subject(subjects[1]).save(function(err, result){
			callback(null, result);
		});
		db.models.Subject(subjects[0]).save();
	},
	function(subject, callback){
		// create some sample courses
		var courses = [
			{
				title: "Artificial Intelligence",
				number: "470",
				description: "Robots and stuff...",
				subject: subject._id,
				hours: {
					min: 3,
					max: 3
				},
				offerings: [
					"Fall",
					"Spring",
					"Summer"
				],
				fee: '30'
			},
			{
				title: "Programming Languages",
				number: "410W",
				description: "Fortran...",
				subject: subject._id,
				hours: {
					min: 3,
					max: 4
				}
			}
		];
		async.map(courses, function(course, cb) {
			db.models.Course(course).save(function(err, result) {
				cb(null, result._id);
			});
		}, function(err, results) {

			// create some sample programs
			var programs = [
			{
				name: "College of Business",
				description: "The College of Business uses on-campus and online programs to serve 1,100 undergraduates and more than 400 graduate students. Forty highly dedicated full-time faculty staff the College—most holding PhDs from leading universities. The College of Business is accredited by the Accreditation Council for Business Schools and Programs (ACBSP) and the Computer Information Systems Program is accredited by ABET, Inc., the most recognized accrediting body for computing programs throughout the world.",
				departments: [
				{
					name: "Computer Science and Information Systems",
					description: "Student majors in CSIS programs have the significant opportunity to work closely with our faculty members for advice, support, and mentoring throughout their chosen program. There are numerous success stories of our graduates who have gone on to highly successful careers in professional work environments. Our graduates are positioned to join these alumni in significant and rewarding careers.",
					programs: [
						{
							type: "major",
							name: "Computer Information Systems",
							description: "CIS focuses on the application of information technology in an organizational environment with an emphasis on the analysis, design, implementation, and support of business information systems. CIS students develop an in-depth understanding of the application of information technology in core business processes and functions as well as the skills necessary to effectively use technology to solve business problems. The CIS curriculum is structured to provide a strong foundation for careers in IT management, software development, systems/business analysis, web development, infrastructure design and administration, project management, and database development.",
							requirements: [{
								name: "Core Requirements",
								separator: "AND",
								items: [
									{
										separator: 'AND',
										courses: [
											results[0]
										]
									},
									{
										separator: 'AND',
										courses: [
											results[1]
										]
									}
								]
							}]
						},
						{
							type: "major",
							name: "Computer Science",
							description: "The science of computational theory, algorithmic processes, and the design of hardware and software.",
							requirements: [{
								name: "Core Requirements",
								separator: "AND",
								items: [
									{
										separator: 'AND',
										courses: [
											results[0]
										]
									},
									{
										separator: 'AND',
										courses: [
											results[1]
										]
									}
								]
							}]
						},
						{
							type: "minor",
							name: "Human-Computer Interaction/User Experience",
							description: "emotional impact cannot be designed - only experienced"
						}
					]
				}],
				programs: [{
				  type: "type",
				  name: "name",
				  description: "description"
				}]
			},
			{
				name: "College of Arts and Sciences",
				description: "The college of Science, Technology, Engineering, Arts and Mathematics, 19 different departments with an array of majors, minors and certificate programs working independently and together to ignite the dream that creates the steam that powers your future. Join us and get ahead!",
				departments: [
				{
					name: "English",
					description: "The student of English develops skills and insights that are valued highly by employers in virtually all professional fields. The study of English does not concern itself only with types and styles of literary endeavor; it also involves the study of humankind in relation to community, work, religion, and individual identity.",
					programs: []
				}],
				programs: []
			}
			];
			for(var i in programs){
				db.models.Program(programs[i]).save();
			}
			callback();
		});
	},
	function(callback){
		// create some sample textSections
		var textSections = {
			sections: [
				{
					title: "University Information",
					content: "<p align=\"center\">The University of North Alabama is accredited by the Southern Association of Colleges and Schools Commission on Colleges to award bachelor&rsquo;s, master&rsquo;s and education specialist degrees. Contact the Commission on Colleges at 1866 Southern Lane, Decatur, Georgia 30033-4097 or call 404-679-4500 for questions about the accreditation of the University of North Alabama.</p>\n\n<p align=\"center\"><strong>&bull;&nbsp;&bull;&nbsp;&bull; ACCREDITED BY&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;</strong></p>\n\n<p align=\"center\">The Bachelor of Arts and Bachelor of Science in Industrial Hygiene are accredited by the Applied Science Accreditation Commission (ASAC) of ABET http://www.abet.org</p>\n\n<p align=\"center\">Accreditation Council for Business Schools and Programs</p>\n\n<p align=\"center\">The Bachelor of Business Administration in Computer Information Systems is accredited by the Computing Accreditation Commission (CAC) of ABET http://www.abet.org</p>\n\n<p align=\"center\">The Bachelor of Science in Computer Science is accredited by the Computing Accreditation Commission (CAC) of ABET http://www.abet.org</p>\n\n<p align=\"center\">The College of Education and Human Sciences at the University of North Alabama is accredited by the National Council for Accreditation of Teacher Education (NCATE), www.ncate.org</p>\n\n<p align=\"center\">This accreditation covers initial teacher preparation programs and advanced educator preparation programs. However, the accreditation does not include individual education courses that the institution offers to P-12 educators for professional development, relicensure, or other purposes.</p>\n\n<p align=\"center\">The Council on Social Work Education (Baccalaureate)</p>\n\n<p align=\"center\">The National Association of Schools of Music</p>\n\n<p align=\"center\">The National Association of Schools of Art and Design Commission on Collegiate Nursing EducationOne Dupont Circle NW, Suite 530, Washington, DC 20036; Telephone (202) 463-6930</p>\n\n<p align=\"center\">The Community Counseling (M.A.) and the School Counseling (M.A.Ed.) graduate programs in the Department of Counselor Education are accredited by the Council for Accreditation of Counseling and Related Educational Programs (CACREP) under the 2001 Standards, and approved by the International Registry of Counselor Education Programs (IRCEP), an international affiliate of CACREP.</p>\n\n<p align=\"center\">The National Kitchen and Bath Association</p>\n\n<p align=\"center\"><strong>&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;CERTIFIED BY &bull;&nbsp;&bull;&nbsp;&bull;</strong></p>\n\n<p align=\"center\">The American Chemical Society</p>\n\n<p align=\"center\"><strong>&bull;&nbsp;&bull;&nbsp;&bull; DESIGNATED AS&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;</strong></p>\n\n<p align=\"center\">A Literary Landmark by the Friends of Libraries USA</p>\n"
				},
				{
					title: "Description of the University",
					content: "<h2>MISSION AND VISION</h2>\n\n<p>&nbsp;&nbsp; &nbsp;As a regional, state-assisted institution of higher education, the University of North Alabama pursues its <strong>Mission </strong>of engaging in teaching, research, and service in order to provide educational opportunities for students, an environment for discovery and creative accomplishment, and a variety of outreach activities meeting the professional, civic, social, cultural, and economic development needs of our region in the context of a global community.</p>\n\n<p>&nbsp;&nbsp; &nbsp;The <strong>Vision </strong>of the University of North Alabama builds upon nearly two centuries of academic excellence. We commit ourselves to design and offer a rich undergraduate experience; to respond to the many educational and outreach needs of our region, including the provision of high quality graduate programs in selected disciplines; to provide an extracurricular environment that supports and enhances learning; to provide a global education and participate in global outreach through distance learning programs; and to foster a diverse and inclusive academic community. We promote global awareness by offering a curriculum that advances understanding of global interdependence, by encouraging international travel, and by building a multinational student population. We pledge to support and encourage intellectual growth by offering primarily small, interactive classes taught by highly educated professionals, and through mentoring, internships, and other out-of-class educational opportunities.</p>\n\n<h2>UNIVERSITY VALUES</h2>\n\n<p>&nbsp;&nbsp; &nbsp;The members of the University of North Alabama community maintain a culture that:</p>\n\n<ul>\n\t<li>Values students and the student learning experience both inside and outside the classroom.</li>\n\t<li>Adheres to personal academic and intellectual integrity.</li>\n\t<li>Embraces and promotes an inclusive environment that welcomes all cultural backgrounds, personal characteristics, and life situations represented in this community.</li>\n\t<li>Values an environment for the free expression of ideas, opinions, thoughts, and differences in people.</li>\n\t<li>Respects the rights, dignity and property of all.</li>\n</ul>\n\n<h2>UNIVERSITY GOALS</h2>\n\n<p>The University of North Alabama has identified five broad university goals that guide planning and resource allocation throughout the University. These goals are intended to be aspirations in that they are assumed to inspire, to guide, and to be on-going. Each university goal should result in a number of long-term and annual initiatives that support progress toward accomplishing the broader aspiration. The five university goals are:</p>\n\n<ul>\n\t<li>Build and Maintain a Student-Centered University.</li>\n\t<li>Build an Enriched Academic Experience.</li>\n\t<li>Enhance Programs that Distinguish the University.</li>\n\t<li>Promote an Inclusive Campus Environment.</li>\n\t<li>Support Regional Development and Outreach.</li>\n</ul>\n\n<h2>HISTORY AND LOCATION</h2>\n\n<p>The University of North Alabama traces its origin to LaGrange College, which was established in 1830 at LaGrange, Alabama, by the Methodist Church, and then to its successor, Wesleyan University, established in Florence in 1855. In 1872, the school was established as a State Normal School, the first of its kind in the South. Across the years, the continued growth of the institution in size, scope, and purpose is reflected by a series of name changes: Florence State Teachers College (1929), Florence State College (1957), Florence State University (1968), and the University of North Alabama (1974).</p>\n\n<p>The University occupies over 200 acres in Florence, Alabama, which is located just north of the Tennessee River and is the largest of four cities that make up an area referred to as the &ldquo;Shoals.&rdquo; According to the Shoals Area Chamber of Commerce website, the entire metropolitan area has a population of approximately 143,000 people.</p>\n\n<p>The University is a state-assisted, coeducational institution offering undergraduate and graduate degree programs. It is organized into four academic colleges: arts and sciences, business, education and human sciences, nursing and a &ldquo;university college&rdquo; that oversees interdisciplinary studies.</p>\n\n<h2>LITERARY LANDMARK</h2>\n\n<p>The University was designated as a Literary Landmark by Friends of Libraries U.S.A. in 2006. UNA is the first site in the State of Alabama to receive this honor. The designation is based upon the role of the University in the life and writing of Pulitzer Prize winning author T.S. Stribling. Stribling, a 1903 graduate of the institution, was awarded the Pulitzer for Literature in 1933 for THE STORE. THE STORE was the second work in his epic trilogy portraying the lives of a fictional family in Lauderdale County, Alabama, as they dealt with the Civil War, Reconstruction, and the boom period of the 1920s. The University library houses an extensive collection of Stribling writings, research materials, and memorabilia.</p>\n\n<p>&nbsp;</p>\n"
				},
				{
					title: "Academic Procedures",
					content: "<p>&nbsp;&nbsp; &nbsp;Students who are seeking admission or readmission to the University must file appropriate documents with the Office of Admissions located in Coby Hall. Regardless of intended major, all applications, with the exception of international students, are processed in this office. High school and (if applicable) college transcripts are evaluated in this office, along with standardized test scores and other required admission-related items. In the case of transfer students, academic records are examined to determine eligibility for transfer credit.</p>\n\n<p>&nbsp;&nbsp; &nbsp;The academic programs in business, teacher education, and nursing have special admission requirements in addition to the general admission requirements. Acceptance to UNA does not necessarily constitute admission to any of these programs. Students who desire to enter teacher education or nursing should refer to the related sections in this catalog, visit the UNA website, and/or consult with the dean of the associated college for specific admission criteria.</p>\n\n<h2>POLICY OF NONDISCRIMINATION</h2>\n\n<p>&nbsp;&nbsp; &nbsp;The University of North Alabama is an equal opportunity institution and does not discriminate in the admission policy on the basis of race, color, gender, religion, disability, age, or national origin.</p>\n\n<p>&nbsp;&nbsp; &nbsp;The University of North Alabama reserves the right to refuse admission to any applicant whose presence is deemed detrimental to the institution or its students.</p>\n\n<h2>PROCEDURES FOR ADMISSION</h2>\n\n<p>&nbsp;&nbsp; &nbsp;Each student must file a standard application for admission form accompanied by a nonrefundable $25.00 application fee to cover processing costs. Application forms are available in most guidance and counseling offices of high schools and junior or community colleges in Alabama and the surrounding region. Otherwise, they may be obtained by contacting the UNA Office of Admissions, UNA Box 5011, Florence, AL 35632-0001, online at <a href=\"http://www.una.edu/admissions\">http://www.una.edu/admissions</a>, or by calling 256-765-4608. Outside of the local calling area, applicants may call 1-800-TALK-UNA (1-800-825-5862).</p>\n\n<p>&nbsp;&nbsp; &nbsp;Students may seek admission to the University of North Alabama in any of the following categories:</p>\n\n<p>&nbsp;&nbsp; &nbsp;<strong>Beginning Freshmen</strong>. Beginning freshmen are students who have never attended another college or university. Students who have attended another institution(s) during the summer immediately after high school graduation or have been dually enrolled while in high school are also considered to be beginning freshmen. To support the application process, they are to ask that ACT or SAT scores and high school transcripts be sent directly to the UNA Office of Admissions. Transcripts are typically sent by designated guidance counselors upon request by the students. If application is made while still enrolled in high school, the transcripts should show Admission to the University 21 the latest available grades at least through the junior year, and ACT or SAT scores. Subsequently, final transcripts must be sent showing confirmation of graduation and the graduation date. Having these documents sent to UNA is the applicant&rsquo;s responsibility, and it should be clearly understood that application procedures are incomplete until all items are on file. Failure to complete this process will jeopardize students&rsquo; admission to the University. Students seeking admission on the basis of General Education Development (GED) tests must have official copies of those scores sent.</p>\n\n<p>&nbsp;&nbsp; &nbsp;<strong>Transfer Students</strong>. Applicants who have attended other colleges or universities will be considered as transfer students. Transfer student applicants must have transcripts sent from all previously attended institutions regardless of whether or not credit was actually earned. The application process requires that students list all institutions attended. Failure to do so may result in denial of admission or subsequent cancellation of admission. Transfer students who have earned fewer than 24 semester hours of credit must also submit high school transcripts and ACT or SAT scores and must meet admission standards which are applied to beginning freshmen.</p>\n\n<p>&nbsp;&nbsp; &nbsp;<strong>Former Students</strong>. UNA students who wish to reenroll after an absence of one or more fall or spring semesters must apply for reactivation as former students. Summer terms have no effect on this category. Readmission forms are available in the Office of Admissions. Former students should refer to the reactivation requirements described later in this section under Former Students.</p>\n\n<p>&nbsp;&nbsp; &nbsp;<strong>Transient Students</strong>. Students in good standing who are enrolled in a degree program at another college or university may, with the written approval of the parent institution, enroll at UNA as transient students. Such enrollment typically occurs during the summer months. Transient approval forms are available in the academic deans&rsquo; offices. This form should be filed instead of a transcript. Additional information is available in this section under Transient Student.</p>\n\n<p>&nbsp;&nbsp; &nbsp;<strong>UNA Early College</strong>. Academic achieving high school students may enroll in the UNA Early College program and take a limited number of college courses if they receive permission from their high schools. Early College students must receive special approval from the Vice Provost for International Affairs to take study abroad courses and must pay tuition for these courses and all costs involved. Forms are available in the UNA Office of Admissions or on the UNA website, and must be completed by the high school principal or guidance counselor. An official copy of the high school transcript should be sent by the high school directly to the UNA Office of Admissions. Early College tuition rate is $100 per course effective with the 2014 summer term. For application deadlines, please refer to <a href=\"http://www.una.edu/admissions\">http://www.una.edu/admissions</a>.</p>\n\n<p>&nbsp;&nbsp; &nbsp;<strong>Special Students</strong>. Under certain circumstances, students may enroll at UNA as special students. These are not considered to be degree-seeking students. Admission as a special student requires approval by the Vice President for Enrollment Management. Additional information is available in this section under Special Students.</p>\n"
				}
			]
		};
		db.models.TextSection(textSections).save();

		// create some sample generalRequirements
		var requirements = [
			{
				area: 'I',
				name: "Written Composition",
				requirements: [{
					name: "requirement",

					separator: "OR",
					items: [
						{
							separator: 'AND',
							courses: [],
							writeIn: {
								content: "Sing the alphabet backwards",
								hours: {
									min: 1,
									max: 3
								}
							},
							isWriteIn: true
						},
						{
							separator: 'AND',
							courses: [],
							isWriteIn: true,
							writeIn: {
								content: "Sing the alphabet backwards 2",
								hours: {
									min: 1,
									max: 3
								}
							}
						}
					]
				}]
			},
			{
				area: 'II',
				name: "Humanities and Fine Arts",
				requirements: [{
					name: "requirement",
					items: [{
						separator: 'OR',
						courses: [],
						isWriteIn: false
					}]
				}]
			},
			{
				area: 'III',
				name: "Natural Sciences and Mathematics",
				requirements: [{
					name: "requirement",
					items: [{
						separator: 'OR',
						courses: [],
						isWriteIn: false
					}]
				}]
			},
			{
				area: 'IV',
				name: "History, Social and Behavioral Sciences",
				requirements: [{
					name: "requirement",
					items: [{
						separator: 'OR',
						courses: [],
						isWriteIn: false
					}]
				}]
			},
			{
				area: 'V',
				name: "Additional Requirements",
				requirements: [{
					name: "requirement",
					items: [{
						separator: 'OR',
						courses: [],
						isWriteIn: false
					}]
				}]
			}
		];
		// Add the areas in order
		async.eachSeries(requirements, function(requirement, callback) {
			db.models.GeneralRequirement(requirement).save(function() {
				callback();
			});
		});

		db.models.FacultyAndStaff(
			{
				content: "<p>The names of the faculty as of October 1, 2014, are listed below. The date in parentheses indicates the year that person joined the faculty.</p>\n\n<p>NOE A. AGUADO (2003)</p>\n\n<ul>\n\t<li>Associate Professor of Political Science B.A., 1996, M.P.A., 1998, St. Mary&rsquo;s University; Ph.D., 2003, University of Kansas.</li>\n</ul>\n\n<p>JAMES W. ALDRIDGE (2011)</p>\n\n<ul>\n\t<li>Visiting Associate Professor of Entertainment Industry B.S., 1978, University of North Alabama.</li>\n</ul>\n\n<p>PAULETTE S. ALEXANDER (1981)</p>\n\n<ul>\n\t<li>Associate Dean for the College of Business, Professor of Computer Information Systems B.S., 1969, M.A., 1970, University of Alabama; M.P.A., 1973, The University of Texas at Austin; Ph.D., 2001, The University of Memphis; C.D.P.</li>\n</ul>\n\n<p>ALEJANDRA ALVARADO-BRIZUELA (2013)</p>\n\n<ul>\n\t<li>Assistant Professor of Spanish B.A., 2002, University of Costa Rica; M.A., 2005, Ph.D., 2012, Indiana State University.</li>\n</ul>\n\n<p>DOUGLAS E. ANDREWS (2014)</p>\n\n<ul>\n\t<li>Visiting Instructor in Chemistry B.S., 1971, Florence State University; M.C.S., 1976, The University of Mississippi.</li>\n</ul>\n"
			}
		).save();

		// create some sample changeRequests
		var changes = [
			{
				author: "Sean Connery",
				username: "sean_connery",
			 	timeOfRequest: Date.now(),
				timeOfApproval: null,
				status: "pending",
				requestTypes: [
					"Change in Course Description",
				],
				revisedFacultyCredentials: {
					needed: false,
					content: null
				},
				courseListChange: {
					needed: false,
					content: null
				},
				effective: {
					semester: "Fall",
					year: "2016"
				},
				courseFeeChange: null,
				affectedDepartmentsPrograms: "Computer Science and Information Systems",
				approvedBy: "Renee Vandiver",
				description: "Change course description for CS310 to 'learning how to write assembly for a computer nobody uses any more'"
			},
			{
				author: "Sean Connery",
				username: "sean_connery",
			 	timeOfRequest: Date.now(),
				timeOfApproval: Date.now(),
				status: "approved",
				requestTypes: [
					"Addition of/Change in Course Fee",
				],
				revisedFacultyCredentials: {
					needed: false,
					content: null
				},
				courseListChange: {
					needed: false,
					content: null
				},
				effective: {
					semester: "Fall",
					year: "2016"
				},
				courseFeeChange: null,
				affectedDepartmentsPrograms: "Computer Science and Information Systems",
				approvedBy: "Renee Vandiver",
				description: "Change course fee for CS455 to $3000 so nobody can graduate. hehe"
			}
		];
		for(var i in changes){
			//db.models.ChangeRequest(changes[i]).save();
		}
		// create some sample adminSection
		var admins = [
			{
				privilege: 5,
				username: "primaryAdmin",
				apps: ['catalog'],
				password: crypto.createHash('md5').update("punchcards_rock").digest('hex')
			},
			{
				privilege: 5,
				username: "primary",
				apps: ['catalog'],
				password: crypto.createHash('md5').update("Primary1").digest('hex')
			},
			{
				privilege: 2,
				username: "secondaryAdmin",
				apps: ['catalog'],
				password: crypto.createHash('md5').update("punchcards_rock").digest('hex')
			},
			{
				privilege: 2,
				username: "secondary",
				apps: ['catalog'],
				password: crypto.createHash('md5').update("Secondary1").digest('hex')
			}
		];
		for(var i in admins){
			db.models.Admin(admins[i]).save();
		}
		callback(); // we're done. go to the next function
	},
	/*
  function(callback) {
    var years = [];
    for(var year = 2003; year <= 2016; year++) {
      years.push(year);
    }
    async.each(years, function(year, cb) {
      async.waterfall([
        function(cb1) {
          var filename = 'undergraduate_catalog_' + year + '-' + (year+1) + '.pdf';
          var stream = fs.createReadStream(__dirname + '/../private/initialarchives/' + filename)
          .pipe(fs.createWriteStream(__dirname + '/../public/public/archives/' + filename));
          stream.on('close', function() {
            cb1();
          });
        },
        function(cb1) {
          new db.models.CatalogYear({beginYear: year, endYear: year+1}).save(function(err) {
            console.log(err);
            cb1();
          });
        }], function() {
        cb();
      });
    }, function() {
      callback();
    });
  },
  */
	function(callback){
		// keep adding more functions baby...
		callback();
	},
], function() {
	console.log("Ok I'm done.");
});

