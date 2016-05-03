angular.module("todoListApp", ["checklist-model"])
    .controller('mainCtrl', function ($scope, $rootScope) {
        $scope.helloWorld = function () {
            console.log("Hello there! This is the helloWorld controller function in the mainCtrl!");
        };
        $scope.myName = "Sean Connery";
        $scope.perspective = $scope.myName;
        $scope.newCourse = false;

        $scope.changes = [

    'Change in Course Description'
    
            , 'New Major/Option/Concentration/Minor'
    
            , 'Cross Listing of Course'
    
            , 'Revised Major/Option/Concentration/Minor'
    
            , 'Inactivation of Course'
    
            , 'New/Revised Certificate Program'
    
            , 'Merger of Major/Option/Concentration/Minor'
    
            , 'Revised   Requirement'
    
            , 'Revised Course Number/Title/Credit/Prerequisite'
    
            , 'Editorial Change'
    
            , 'Change to General Education Component'
    
            , 'Other'

  ];
        $scope.user = {};
        $scope.newCourse = "false";


        $scope.deleteTodo = function(id){
            alert(id);
        }


        $scope.todos = {
            "success": true
            , "data": [
                {
                    "_id": "571052e8ad4a865d3a18d454"
                    , "author": "Sean Connery"
                    , "username": "sean_connery"
                    , "timeOfRequest": 1460687978978
                    , "timeOfApproval": null
                    , "status": "pending"
                    , "requestTypes": [
                "Change in Course Description"
             ]
                    , "revisedFacultyCredentials": {
                        "needed": true
                        , "content": "hey"
                    }
                    , "courseListChange": {
                        "needed": true
                        , "content": "changing A course"
                    }
                    , "effective": {
                        "semester": "Fall"
                        , "year": "2016"
                    }
                    , "courseFeeChange": "added $600 fee"
                    , "affectedDepartmentsPrograms": "Computer Science and Information Systems"
                    , "approvedBy": "Renee Vandiver"
                    , "description": "Change course description for CS310 to 'learning how to write assembly for a computer nobody uses any more'"
        }
                
                , {
                    "_id": "571052e8ad4a865d3a18d458"
                    , "author": "Sean Connery"
                    , "timeOfRequest": 1460687978978
                    , "timeOfApproval": 1460687997358
                    , "status": "denied"
                    , "requestTypes": [
                "Addition of/Change in Course Fee"
             ]
                    , "revisedFacultyCredentials": {
                        "needed": false
                        , "content": null
                    }
                    , "courseListChange": {
                        "needed": false
                        , "content": null
                    }
                    , "effective": {
                        "semester": "Fall"
                        , "year": "2016"
                    }
                    , "courseFeeChange": null
                    , "affectedDepartmentsPrograms": "Computer Science and Information Systems"
                    , "approvedBy": "Renee Vandiver"
                    , "description": "Change course fee for CS455 to $3000 so nobody can graduate. hehe"
                    , "comment": "WTF??"
        }
  ]

        }
        
        $scope.denyTodo = function(id,comment){
            alert(comment + id);
        }
        
        
        $scope.acceptTodo= function(id,comment){
            alert(comment + id);
        }

        $scope.pushRequest = function () {

            $scope.responseObj = {
                "requestTypes": $scope.user
                , "revisedFacultyCredentials": {
                    "needed": $scope.newTodo.credentials
                    , "content": $scope.newTodo.credentialsContent
                }
                , "courseListChange": {
                    "needed": $scope.newTodo.changeCourse
                    , "content": $scope.changeCourseContent
                }
                , "effective": {
                    "semester": "Fall"
                    , "year": "2016"
                }
                , "courseFeeChange": $scope.newTodo.justification
                , "affectedDepartmentsPrograms": $scope.newTodo.affectedDepartments
                , "approvedBy": null
                , "description": $scope.newTodo.description
            };
        }
    });