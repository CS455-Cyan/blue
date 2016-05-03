angular.module('AppAdmin')
.directive('catalogRequirements', [
	'CatalogAPI',
	function(CatalogAPI) {
		function link(scope, element, attrs) {
			
			//scope.requirements = scope.requirementsArr;
			console.log(scope.requirements)
			scope.refresh = function() {
				scope.currentlySelected.group = null;
				scope.refreshRequirements();
			}
			
			scope.callUpdateRequirement = function(group) {
				var action = scope.updateRequirement;
				if(group.isNew) {
					action = scope.addRequirement;
				}
				action(group, function(success) {
					scope.refresh();
					if(success) {
						alert("Changes saved successfully")
					} else {
						alert("Changes could not be saved")
					}
				});
			}
			
			scope.callRemoveRequirement = function(group, id) {
				if(confirm("Delete requirement?")) {
					scope.removeRequirement(group, id, function(success) {
						scope.refresh();
						if(success) {
							alert("Requirement removed successfully");
						} else {
							alert("Requirement could not be removed");
						}
					});
				}
			}
			
			scope.currentlySelected = {
				group: null
			}
														
			scope.newRequirement = function() {
				var requirement = {
					name: '',
					separator: "AND",
					items: [],
					isNew: true
				};
				scope.removeEmptyItems(scope.requirements, function(item) {
					if(item && item.name && item.items) {
						return !item.name.length && !item.items.length;
					}
					else return true;
				});
				scope.requirements.push(requirement);
				scope.currentlySelected.group = requirement;
			}

			scope.addItem = function() {
				var item = {
					courses: [],
					isWriteIn: false,
					separator: 'AND',
					isWriteIn: false,
					writeIn: {
						hours: {}
					}
				}
				scope.currentlySelected.group.items.push(item);
			}
			
			scope.removeItem = function(items, id) {
				scope.removeByIndex(items, id);
			}

			scope.addCourse = function(item) {
				// first get rid of any empty items to avoid errors
				scope.removeEmptyItems(item.courses, function(i) {
					return !i;
				});
				item.courses.push(null);
			}

			scope.cancelRequirement = function() {
				scope.refresh();
			}

			scope.removeByIndex = function(list, index) {
				list.splice(index, 1);
			}

			scope.removeEmptyItems = function(list, isEmpty) {
				for(var i=0; i<list.length; i++) {
					if(isEmpty(list[i])) {
						list.splice(i, 1);
						i--; // everything gets shifted back by one
					}
				}
				return list;
			}

			scope.removeById = function(list, id) {
				for(var i in list) {
					if(list[i]._id == id) {
						list.splice(i, 1);
					}
				}
			}

			scope.cancel = function() {
				scope.refresh();
			}

			// Load data initially
			scope.refresh();
			CatalogAPI.listCourses(function(courses) {
				scope.allCourses = courses;
			});
			
		}
		
		var directive = {
			restrict: 'E',
			scope: {
				refreshRequirements: '=',
				requirements: '=',
				addRequirement: '=',
				removeRequirement: '=',
				updateRequirement: '='
			},
			link: link,
			templateUrl: 'views/catalog/requirements/index.html'
		};

		return directive;
	}
]);