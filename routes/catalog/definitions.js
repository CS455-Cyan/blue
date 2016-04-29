var definitionExports = {};

definitionExports.appname = 'catalog';
definitionExports.privilege = {
	primaryAdmin: 5,
	secondaryAdmin: 2
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

module.exports = definitionExports;