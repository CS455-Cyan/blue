/***																					***\

	Filename: catalog-api.services.js
	Author: CS455 Cyan

	Copyright (c) 2015 University of North Alabama

\***																					***/


var CatalogAPIService = function() {

	/*
		Function: API.listTextSections
		Description: Fetch a list of all text sections
		Input:
			callback: function to execute once text sections are found
		Output:
			callback is called when text sections are found, with the text section passed in as a parameter
		Created: Tyler Yasaka 04/19/2016
		Modified:
	*/
	this.listTextSections = function(callback) {
		getHTTP('/catalog/textSections', function(res) {
			callback(res.data);
		});
	};

	/*
		Function: API.listGeneralRequirements
		Description: Fetch a list of all general requirements
		Input:
			callback: function to execute once general requirements are found
		Output:
			callback is called when general requirements are found, with the general requirements passed in as a parameter
		Created: Tyler Yasaka 04/19/2016
		Modified:
	*/
	this.listGeneralRequirements = function(callback) {
		getHTTP('/catalog/generalRequirements', function(res) {
			callback(res.data);
		});
	};

	/*
		Function: API.addGeneralRequirement
		Description: Add a general requirement to an area
		Input:
			callback: function to execute on completion
		Output:
			callback is called on completion, with the result passed in as a parameter
		Created: Tyler Yasaka 05/1/2016
		Modified:
	*/
	this.addGeneralRequirement = function(area, requirementObject, callback) {
		postHTTP(
			'/admin/catalog/generalRequirements/' +
			area,
			requirementObject,
			function(res) {
				callback(res.success);
			}
		);
	};

	/*
		Function: API.updateGeneralRequirement
		Description: Update a general requirement
		Input:
			requirementObject: new data
			callback: function to execute once backend returns data
		Output:
		Created: Seth Putman 04/27/2016
		Modified:
	*/
	this.updateGeneralRequirement = function(area, requirementObject, callback) {
		putHTTP(
			'/admin/catalog/generalRequirements/' +
			area +
			'/' +
			requirementObject._id,
			requirementObject,
			function(res) {
				callback(res.success);
			}
		);
	};

	/*
		Function: API.removeGeneralRequirement
		Description: Remove a general requirement from an area
		Input:
			callback: function to execute on completion
		Output:
			callback is called on completion, with the result passed in as a parameter
		Created: Tyler Yasaka 05/1/2016
		Modified:
	*/
	this.removeGeneralRequirement = function(area, requirementId, callback) {
		deleteHTTP(
			'/admin/catalog/generalRequirements/' +
			area +
			requirementObject._id,
			function(res) {
				callback(res.success);
			}
		);
	};

	/*
		Function: API.getTextSection
		Description: Fetch a specific text section by id
		Input:
			id: id of text section to fetch (String)
			callback: function to execute once the text section is found
		Output:
			callback is called when text section is found, with the text section passed in as a parameter
		Created: Tyler Yasaka 04/19/2016
		Modified:
	*/
	this.getTextSection = function(id, callback) {
		getHTTP('/catalog/textSections/' + id, function(res) {
			callback(res.data);
		});
	};
	
	this.addTextSection = function(payload, callback) {
		postHTTP(
			'/admin/catalog/textSections',
			payload,
			function(res) {
				callback(res.success);
			}
		);
	};
	
	this.updateTextSection = function(id, payload, callback) {
		putHTTP(
			'/admin/catalog/textSections/' +
			id,
			payload,
			function(res) {
				callback(res.success);
			}
		);
	};
	
	this.deleteTextSection = function(id, callback) {
		deleteHTTP(
			'/admin/catalog/textSections/' +
			id,
			function(res) {
				callback(res.success);
			}
		);
	};

	/*
		Function: API.listCategories
		Description: Fetch a list of all categories
		Input:
			callback: function to execute once categories are found
		Output:
			callback is called when categories are found, with the categories passed in as a parameter
		Created: Tyler Yasaka 04/17/2016
		Modified:
	*/
	this.listCategories = function(callback) {
		getHTTP('/catalog/programs/categories', function(res) {
			callback(res.data);
		});
	};

	/*
		Function: API.getCategory
		Description: Fetch a specific category by id
		Input:
			id: id of category to fetch (String)
			callback: function to execute once the category is found
		Output:
			callback is called when category is found, with the category passed in as a parameter
		Created: Tyler Yasaka 04/17/2016
		Modified:
	*/
	this.getCategory = function(id, callback) {
		getHTTP('/catalog/programs/categories/' + id, function(res) {
			callback(res.data);
		});
	};

			/*
		Function: API.updateCategory
		Description: Update a category by ID
		Input:
			id: id of category to fetch (String)
							category: the specific category's object
			callback: function to execute once the category is changed
		Output:
			callback is called when category is changed, with a boolean flag passed in as a parameter
		Created: Graem Cook 4/27/2016
		Modified:
	*/
	this.updateCategory = function(id, category, callback) {
		putHTTP(
			'/admin/catalog/programs/categories/' +
			id,
			category,
			function(res) {
				callback(res.success);
			}
		);
	};

	/*
		Function: API.getDepartment
		Description: Fetch a specific department by id
		Input:
			categoryId: id of program category (String)
			departmentId: id of program department (String)
			callback: function to execute once the department is found
		Output:
			callback is called when program is found, with the category and department passed in as parameters
		Created: Tyler Yasaka 04/19/2016
		Modified:
	*/
	this.getDepartment = function(categoryId, departmentId, callback) {
		getHTTP(
			'/catalog/programs/categories/' +
			categoryId +
			'/departments/' +
			departmentId,
			function(res) {
				callback(res.data.category, res.data.department);
			}
		);
	};

			/*
		Function: API.updateDepartment
		Description: Update a department by ID
		Input:
			id: id of department to fetch (String)
							category: the specific department's object
			callback: function to execute once the department is changed
		Output:
			callback is called when department is changed, with a boolean flag passed in as a parameter
		Created: Graem Cook 4/28/2016
		Modified:
	*/
	this.updateDepartment = function(categoryID, departmentID, department, callback) {
		putHTTP(
			'/admin/catalog/programs/categories/' +
			categoryId +
			'/departments/' +
			departmentId,
			department,
			function(res) {
				callback(res.success);
			}
		);
	};

	/*
		Function: API.getProgram
		Description: Fetch a specific program by id
		Input:
			categoryId: id of program category (String)
			departmentId: id of program department (String)
			programId: id of program (String)
			callback: function to execute once the program is found
		Output:
			callback is called when program is found, with the category, department, and program passed in as parameters
		Created: Tyler Yasaka 04/17/2016
		Modified:
	*/
	this.getProgram = function(categoryId, departmentId, programId, callback) {
		var url = '/admin/catalog/programs/categoies/' + categoryID;
		if(departmentID) {
			url += '/departments/' + departmentID;
		}
		url += '/programs/' + programID;
		getHTTP(url, function(res) {
				callback(res.data);
		});
	};

			/*
		Function: API.updateProgram
		Description: Update a program by ID
		Input:
			categoryID: id of category program is in (String)
			departmentID: id of department program is in (String)
			programID: id of program to update (String)
			program: data to update (object)
			callback: function to execute once the department is changed
		Output:
			callback is called when department is changed, with a boolean flag passed in as a parameter
		Created: Graem Cook 4/28/2016
		Modified:
			Tyler Yasaka 5/1/2016
	*/
	this.updateProgram = function(categoryID, departmentID, programID, program, callback) {
		var url = '/admin/catalog/programs/categoies/' + categoryID;
		if(departmentID) {
			url += '/departments/' + departmentID;
		}
		url += '/programs/' + programID;
		putHTTP(url, program, function(res) {
				callback(res.success);
		});
	};

	this.deleteProgram = function(categoryID, departmentID, programID, callback) {
		var url = '/admin/catalog/programs/categoies/' + categoryID;
		if(departmentID) {
			url += '/departments/' + departmentID;
		}
		url += '/programs/' + programID;
		deleteHTTP(url, function(res) {
				callback(res.success);
		});
	};


	/*
		Function: API.listCourses
		Description: Fetch a list of all courses
		Input:
			callback: function to execute once courses are found
		Output:
			callback is called when courses are found, with the courses passed in as a parameter
		Created: Tyler Yasaka 04/30/2016
		Modified:
	*/
	this.listCourses = function(callback) {
		getHTTP('/catalog/courses', function(res) {
			callback(res.data);
		});
	};

	/*
		Function: API.getCourse
		Description: Fetch a specific course by id
		Input:
			id: id of course to fetch (String)
			callback: function to execute once the course is found
		Output:
			callback is called when course is found, with the course passed in as a parameter
		Created: Tyler Yasaka 04/17/2016
		Modified:
	*/
	this.getCourse = function(id, callback) {
		getHTTP('/catalog/courses/' + id, function(res) {
			callback(res.data);
		});
	};

	/*
		Function: API.listSubjects
		Description: Fetch a list of all subjects
		Input:
			callback: function to execute once subjects are found
		Output:
			callback is called when subjects are found, with the subjects passed in as a parameter
		Created: Tyler Yasaka 04/17/2016
		Modified:
	*/
	this.listSubjects = function(callback) {
		getHTTP('/catalog/subjects', function(res) {
			callback(res.data);
		});
	};

	/*
		Function: API.getSubject
		Description: Fetch a list of all courses for a given subject
		Input:
			subject: id of subject to find courses for
			callback: function to execute once courses are found
		Output:
			callback is called when courses are found, with the courses passed in as a parameter
		Created: Tyler Yasaka 04/17/2016
		Modified:
	*/
	this.getSubject = function(subjectId, callback) {
		getHTTP('/catalog/programs/categories/' + id, function(res) {
			callback(res.data.subject, res.data.courses);
		});
	};

	/*
		Function: API.getTextSection
		Description: Fetch a specific text section by id
		Input:
			id: id of text section to fetch (String)
			callback: function to execute once the text section is found
		Output:
			callback is called when text section is found, with the text section passed in as a parameter
		Created: Tyler Yasaka 04/19/2016
		Modified:
	*/
	this.getFacultyAndStaff = function(callback) {
		getHTTP('/catalog/facultyAndStaff/', function(res) {
			callback(res.data);
		});
	};

			/*
		Function: this.updateFacultyAndStaff
		Description: Updates the Faculty And Staff
		Input:
			id: id of text section to fetch (String)
			callback: function to execute once the text section is found
		Output:
			callback is called when text section is found, with the text section passed in as a parameter
		Created: Sean Vaccaro 4/23/2016
		Modified:
	*/
	this.updateFacultyAndStaff = function(facultyAndStaffData, callback){
		putHTTP(
			'/admin/catalog/facultyAndStaff',
			facultyAndStaffData,
			function(res) {
				callback(res.success);
			}
		);
	};
	
	this.updateAccount = function(payload, callback){
		putHTTP(
			'/admin/password',
			payload,
			function(res) {
				callback(res.success);
			}
		);
	};
	
	this.listAdmins = function(callback) {
		getHTTP('/admin/admins', function(res) {
			callback(res.data);
		});
	};
	
	this.addAdmin = function(payload, callback) {
		postHTTP(
			'/admin/admins',
			payload,
			function(res) {
				callback(res.success);
			}
		);
	};
	
	this.updateAdmin = function(id, payload, callback){
		putHTTP(
			'/admin/password/' + id,
			payload,
			function(res) {
				callback(res.success);
			}
		);
	};
	
	this.deleteAdmin = function(id, callback) {
		deleteHTTP(
			'/admin/admins/' + id,
			function(res) {
				callback(res.success);
			}
		);
	};
	
	this.publishCatalog = function(payload, callback) {
		postHTTP(
			'/admin/catalog/publish',
			payload,
			function(res) {
				callback(res.success);
			}
		);
	};
	
	this.previewCatalog = function(payload, callback) {
		postHTTP(
			'/admin/catalog/preview',
			payload,
			function(res) {
				callback(res.success);
			}
		);
	};

	var urlPrefix = ''; // easily change api url

	var getHTTP = function(theUrl, callback) {
		theUrl += urlPrefix;
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() { 
			if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
				if(callback) {
					callback(JSON.parse(xmlHttp.responseText));
				}
			}
		}
		xmlHttp.open("GET", theUrl, true); // true for asynchronous 
		xmlHttp.send(null);
	}
    this.getHTTP = getHTTP;

	var postHTTP = function(theUrl, payload, callback) {
		theUrl += urlPrefix;
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() { 
			if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
				if(callback) {
					callback(JSON.parse(xmlHttp.responseText));
				}
			}
		}
		xmlHttp.open("POST", theUrl, true); // true for asynchronous 
		xmlHttp.setRequestHeader("Content-type", "application/json");
		xmlHttp.send(JSON.stringify(payload));
	}
    this.postHTTP = postHTTP;

	var putHTTP = function(theUrl, payload, callback) {
		theUrl += urlPrefix;
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() { 
			if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
				if(callback) {
					callback(JSON.parse(xmlHttp.responseText));
				}
			}
		}
		xmlHttp.open("PUT", theUrl, true); // true for asynchronous 
		xmlHttp.setRequestHeader("Content-type", "application/json");
		xmlHttp.send(JSON.stringify(payload));
	}
    this.putHTTP = putHTTP;

	var deleteHTTP = function(theUrl, callback) {
		theUrl = urlPrefix + theUrl;
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() { 
			if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
				if(callback) {
					callback(JSON.parse(xmlHttp.responseText));
				}
			}
		}
		xmlHttp.open("DELETE", theUrl, true); // true for asynchronous 
		xmlHttp.setRequestHeader("Content-type", "application/json");
		xmlHttp.send(null);
	}
};