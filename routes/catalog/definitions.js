/***																					***\

	Filename: routes/definitions.js
	Authors:
			Tyler Yasaka
			Andrew Fisher

***/

var db = require('../../models/catalog.model');
var async = require('async');
var mongoose = require('mongoose');
var fs = require('fs');
var phantomPDF = require('phantom-html2pdf');

var definitionExports = {};

definitionExports.appname = 'catalog';
definitionExports.privilege = {
	primaryAdmin: 5,
	secondaryAdmin: 2
}
definitionExports.sectionTitles = {
	generalRequirements: "General Education Requirements",
	programs: "Colleges and Programs",
	courses: "Courses",
	facultyAndStaff: "Faculty And Staff"
};

/*
	Function: orderGeneralRequirements
	Description: Puts general requirements in correct order
	Input:
		arr: original array to sort
	Output:
		sorted array
	Created: Tyler Yasaka 04/29/2016
	Modified:
*/
definitionExports.orderGeneralRequirements = function(arr) {
	var areas = ['I','II','III','IV','V'];
	var sorted = [];
	for(var a in areas) {
		for(var i in arr) {
			var item = arr[i];
			if(areas[a] == item.area) {
				item.requirements = definitionExports.calculateCredit(item.requirements);
				sorted.push(item);
			}
		}
	}
	return sorted;
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
definitionExports.sortAlphabeticallyByProperty = function(arr, property) {
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
definitionExports.orderPrograms = function(programs) {
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
			definitionExports.sortAlphabeticallyByProperty(types['major'], 'name')
		);
		delete types['major'];
	}
	if(types['minor']) {
		results = results.concat(
			definitionExports.sortAlphabeticallyByProperty(types['minor'], 'name')
		);
		delete types['minor']
	}
	if(types['certificate']) {
		results = results.concat(
			definitionExports.sortAlphabeticallyByProperty(types['certificate'], 'name')
		);
		delete types['certificate'];
	}
	for(var t in types) {
		results = results.concat(
			definitionExports.sortAlphabeticallyByProperty(types[t], 'name')
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
definitionExports.formatCredit = function(hours) {
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
definitionExports.calculateCredit = function(requirements) {
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
			if(item.isWriteIn && item.writeIn && item.writeIn.hours && typeof item.writeIn.hours.min != 'undefined') {
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
			var credit = definitionExports.formatCredit(subtotal);
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
			var totalCredit = definitionExports.formatCredit(total);
			requirements[r].credit = totalCredit;
		}
		else if(requirement.separator == 'OR'){
			var orTotalCredit = definitionExports.formatCredit(orTotal);
			requirements[r].credit = orTotalCredit;
		}
	}
	return requirements;
}

/*
	Function: copyCollection
	Description: Copies each collection into a database
	Input:
		modelName: name of the collection to copy
		callback
	Output:

	Created: Andrew Fisher 04/29/2016
	Modified:

*/
definitionExports.copyCollection = function(fromDB, toDB, modelName, callback){
	fromDB[modelName].find(function(err, items) {
		var functionToExecuteOnEachItem = function(item, cb) {
			item._id = mongoose.Types.ObjectId();
			item.isNew = true;
			new toDB[modelName](item).save(function(err){
				cb(err);
			});
		}
		async.each(
			items,
			functionToExecuteOnEachItem,
			callback
		);
	});
}

/*
	Function: generateCatalogPDF
	Description: Generate PDF of the catalog from database
	Input:
		ear: object containing academic year for this catalog
		callback: function to execute when finished
	Output:
		PDF is stored to the filesystem
	Created: Tyler Yasaka 04/29/2016
	Modified:
*/
definitionExports.generateCatalogPDF = function(year, fileName, callback) {
	var htmlPath = __dirname + fileName;
	var pdfPath = __dirname + fileName;
	async.waterfall([
		function(cb) {
			// Generate HTML of catalog
			definitionExports.generateCatalogHTML(year, function(html) {
				cb(null, html);
			});
		},
		function(html, cb) {
			// save html to file system
			fs.writeFile(htmlPath, html, cb);
		},
		function(cb) {
			// generate pdf
			var options = {
				html: htmlPath,
			};
			phantomPDF.convert(options, function(result) {
				result.toFile(pdfPath, cb);
			})
		}
	], callback);
}

/*
	Function: generateCatalogHTML
	Description: Generate HTML of the catalog from database
	Input:
		year: object containing academic year for this catalog
		callback: function to execute when finished
	Output:
		execute callback, passing generated html as argument
	Created: Tyler Yasaka 04/29/2016
	Modified:
*/
definitionExports.generateCatalogHTML = function(year, callback){
	var html = '';
	html += '<link href=" ' + __dirname + '/../../private/assets/bootstrap.min.css" type="text/css" rel="stylesheet">';
	html += '<div class="container-fluid" style="margin-top: 50px;">';
	html += '<h2>' + year.start + '-' + year.end + ' Undergraduate Catalog</h2>';
	html += '<img class="img-responsive" style="width: 100px; margin: 50px auto" src="'
		+ __dirname
		+ '/../../private/assets/una.jpg" alt="University of North Alabama"/>';
	html += '<h2>University of North Alabama</h2>';

	async.waterfall([

		// text sections
		function(cb) {
			db.models['TextSection'].findOne(function(err, doc) {
				var text = '';
				var sectionTitles = [];
				var tableOfContents = '';
        for(var s in doc.sections) {
          var section = doc.sections[s];
          sectionTitles.push(section.title);
          text += '<h1 style="page-break-before:always;">';
          text += section.title;
          text += '</h1>'
          text += section.content;
        }
        tableOfContents += '<h2 style="page-break-before:always;">';
        tableOfContents += 'Table of Contents</h2>';
        tableOfContents += '<table class="table">';
        sectionTitles = sectionTitles.concat([
        	definitionExports.sectionTitles.generalRequirements,
        	definitionExports.sectionTitles.programs,
        	definitionExports.sectionTitles.courses,
        	definitionExports.sectionTitles.facultyAndStaff
        ]);
        for(var t in sectionTitles) {
        	var title = sectionTitles[t];
        	tableOfContents += '<tr><td>' + title + '</tr></td>';
        }
        tableOfContents += '</table>';
        html += tableOfContents;
        html += text;
				cb(); // move on
			});
		},

		// general requirements
		function(cb) {
			html += '<h1 style="page-break-before:always;">';
			html += definitionExports.sectionTitles.generalRequirements;
			html += '</h1>';
			db.models['GeneralRequirement'].find(function(err, results) {
				var generalRequirements = definitionExports.orderGeneralRequirements(results);
        for(var a in generalRequirements) {
        	var area = generalRequirements[a];
        	// area title (e.g. "Area I - Written Composition")
        	html += '<h2>Area ' + area.area + ' - ' + area.name + '</h2>';
        	html += definitionExports.requirementsToHTML(area.requirements);
        }
				cb(); // move on
			});
		},

		// programs
		function(cb) {
			html += '<h1 style="page-break-before:always;">';
			html += definitionExports.sectionTitles.programs;
			html += '</h1>';
			db.models['Program'].find()
			.populate({
					path: 'departments.programs.requirements.items.courses',
					populate: {
						path: 'subject'
					}
				}).populate({
					path: 'programs.requirements.items.courses',
					populate: {
						path: 'subject'
					}
				})
			.exec(function(err, categories) {
        for(var c in categories) {
        	var category = categories[c];
        	// don't page break on the first category,
        	// since "colleges and programs" heading just made a page break
        	var pagebreak = (c > 0 ? ' style="page-break-before:always;"' : '');
        	html += '<h2 class="catalog-category"' + pagebreak + '>' + category.name + '</h2>';
        	for(var d in category.departments) {
        		var department = category.departments[d];
        		department.programs = definitionExports.orderPrograms(department.programs);
        		html += '<h3 class="catalog-department"><u>Department of ' + department.name + '</u></h3>';
        		html += definitionExports.programsToHTML(department.programs);
        	}
        	if(category.programs && category.programs.length) {
        		category.programs = definitionExports.orderPrograms(category.programs);
        		html += '<h3 class="catalog-department">Other Programs</h3>';
        		html += definitionExports.programsToHTML(category.programs);
        	}
        }
				cb(); // move on
			});
		},

		// courses
		function(cb) {
			html += '<h1 style="page-break-before:always;">';
			html += definitionExports.sectionTitles.courses;
			html += '</h1>';
			db.models['Subject'].find(function(err, subjects) {
				var subjects = definitionExports.sortAlphabeticallyByProperty(subjects, 'abbreviation');
				async.eachSeries(
					subjects,
					function(subject, cb2) { // execute on each item, in order
						html += '<h2>';
						html += subject.name + ' ';
						html += '(' + subject.abbreviation + ')';
						html += '</h2>';
						db.models['Course'].find({subject: subject._id}).exec(function(err, courses) {
							html += '<div class="list-group"><div class="list-group-item">';
							html += 'Course <span class="pull-right">Credit</span>';
							html += '</div>';
							for(var c in courses) {
								var course = courses[c];
								var credit = definitionExports.formatCredit(course.hours);
								var offered = '';
								for(var o in course.offerings) {
									offered += course.offerings[o];
									if(o < course.offerings.length-1) {
										offered += ', ';
									}
								}
								html += '<div class="list-group-item">';
								var course = courses[c];
								html += '<h4 class="catalog-course">';
								html += subject.abbreviation + ' ';
								html += course.number + ' ';
								html += '- ';
								html += course.title;
								html += '<span class="pull-right">' + credit + '</span>';
								html += '</h4>';
								html += '<p>' + course.description + '</p>';
								if(course.offerings && course.offerings.length) {
									html += '<strong>Offered:</strong> ' + offered + '<br>';
								}
								if(course.fee && course.fee > 0) {
									html += '<strong>Fee:</strong> $' + course.fee;
								}
								html += '</div>';
							}
							html += '</div>';
							cb2();
						});
					},
					function(err) { // execute once all have finished
						cb(); // move on
					}
				);
			});
		},

		// faculty and staff
		function(cb) {
			html += '<h1 style="page-break-before:always;">';
			html += definitionExports.sectionTitles.facultyAndStaff;
			html += '</h1>';
			db.models['FacultyAndStaff'].findOne(function(err, facultyAndStaff) {
				html += facultyAndStaff.content;
				cb(); // move on
			});
		}

	],

	function(err) {
		html += '</div>';
		callback(html); // finally done!
	});
}

/*
	Function: programsToHTML
	Description: format a list of programs as HTML
	Input:
		programs: array of program objects
	Output:
		formatted html (String)
	Created: Tyler Yasaka 04/29/2016
	Modified:
*/
definitionExports.programsToHTML = function(programs) {
	var html = '';
	for(var p in programs) {
		var program = programs[p];
		definitionExports.calculateCredit(program.requirements);
		var types = {
			major: 'Major in ',
			minor: 'Minor in ',
			certificate: 'Certificate in ',
		}
		var type = '';
		if(types[program.type]) {
			type = types[program.type];
		}
		html += '<h3 class="catalog-program">';
		html += type + program.name;
		html += '</h3>';
		html += definitionExports.requirementsToHTML(program.requirements);
	}
	return html;
}

/*
	Function: requirementsToHTML
	Description: format a list of requirements as HTML
	Input:
		requirements: array of requirement objects
	Output:
		formatted html (String)
	Created: Tyler Yasaka 04/29/2016
	Modified:
*/
definitionExports.requirementsToHTML = function(requirements) {
	var html = '';
	for(var g in requirements) {
		var group = requirements[g];
		// group name
		html += '<div class="panel panel-default">';
		html += '<div class="panel-heading"><h4>';
		html += group.name;
		html += '</h4></div>';
		// group content
		html += '<table class="table">'
		html += '<tr><th>Requirement</th>';
		html += '<th><span class="pull-right">Credit</span></th></tr>';
		for(var i in group.items) {
			var item = group.items[i];
			//row in table for item
			html += '<tr>';
			// requirement column
			html += '<td>';
			if(item.isWriteIn) {
				html += item.writeIn.content;
			} else {
				for(var c in item.courses) {
					var course = item.courses[c];
					html += course.title;
					// if not last course in list add separator after it
					if(c < item.courses.length - 1) {
						html += '<div>' + item.separator + '</div>';
					}
				}
			}
			html += '</td>';
			// credit column
			html += '<td><span class="pull-right">' + item.credit + '</span></td>';
			html += '</tr>';
		}
		html += '<tr><th>Total</th><th><span class="pull-right">';
		html += group.credit + '</span></th></tr>';
		html += '</table>';
		html += '</div>';
	}
	return html;
}

module.exports = definitionExports;
