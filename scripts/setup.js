/***                                          ***\

  Filename: scripts/initializeDatabase.js
  Authors:
      Tyler Yasaka
      Andrew Fisher
      Kaitlin Snyder

\***                                          ***/

var async = require('../node_modules/async');
var crypto = require('crypto');
var db = require('../models/catalog.model');
var fs = require('fs');

console.log("Alright. One sec...");

//Async allows us to simulate asynchronous behavior in javascript. That way these database queries execute one by one, in order.
async.waterfall([
  function(callback){
    //connect to database before trying to interact with it
    db.connection.on('admin', function(){
      callback();
    });
  },
  // clear any previous data
  function(callback) {
    db.models.CatalogYear.remove().exec(function() {
      callback();
    })
  },
  // clear any previous data
  function(callback) {
    db.models.Subject.remove().exec(function() {
      callback();
    })
  },
  // clear any previous data
  function(callback) {
    db.models.GeneralRequirement.remove().exec(function() {
      callback();
    })
  },
  // initialize pdf archives
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
            cb1();
          });
        }], function() {
        cb();
      });
    }, function() {
      callback();
    });
  },
  // initialize course subjects
  function(callback) {
    subjects = [
      {
        name: 'Accounting',
        abbreviation: 'AC'
      },
      {
        name: 'Art',
        abbreviation: 'AR'
      },
      {
        name: 'American Sign Language',
        abbreviation: 'ASL'
      },
      {
        name: 'Business Education',
        abbreviation: 'BE'
      },
      {
        name: 'Biology',
        abbreviation: 'BI'
      },
      {
        name: 'Business Law',
        abbreviation: 'BL'
      },
      {
        name: 'Chemistry',
        abbreviation: 'CH'
      },
      {
        name: 'Computer Information Systems',
        abbreviation: 'CIS'
      },
      {
        name: 'Criminal Justice',
        abbreviation: 'CJ'
      },
      {
        name: 'Culunary, Nutrition, and Hospitality Management',
        abbreviation: 'CNH'
      },
      {
        name: 'Communication',
        abbreviation: 'COM'
      },
      {
        name: 'Cooperative Education',
        abbreviation: 'COOP'
      },
      {
        name: 'Computer Science',
        abbreviation: 'CS'
      },
      {
        name: 'Economics',
        abbreviation: 'EC'
      },
      {
        name: 'Early Childhood Education',
        abbreviation: 'ECE'
      },
      {
        name: 'Education',
        abbreviation: 'ED'
      },
      {
        name: 'Elementary Education',
        abbreviation: 'EED'
      },
      {
        name: 'Special Education',
        abbreviation: 'EEX'
      },
      {
        name: 'Pre-Engineering',
        abbreviation: 'EG'
      },
      {
        name: 'English',
        abbreviation: 'EN'
      },
      {
        name: 'Entertainment Industry',
        abbreviation: 'ENT'
      },
      {
        name: 'Earth Science',
        abbreviation: 'ES'
      },
      {
        name: 'Engineering Technology',
        abbreviation: 'ET'
      },
      {
        name: 'Exit Examination',
        abbreviation: 'EXIT'
      },
      {
        name: 'Finance',
        abbreviation: 'FI'
      },
      {
        name: 'Foreign Languages',
        abbreviation: 'FL'
      },
      {
        name: 'French',
        abbreviation: 'FR'
      },
      {
        name: 'Family Studies',
        abbreviation: 'FS'
      },
      {
        name: 'First-Year Experience',
        abbreviation: 'FYE'
      },
      {
        name: 'Geography',
        abbreviation: 'GE'
      },
      {
        name: 'German',
        abbreviation: 'GR'
      },
      {
        name: 'Human Environmental Sciences',
        abbreviation: 'HES'
      },
      {
        name: 'History',
        abbreviation: 'HI'
      },
      {
        name: 'Honors',
        abbreviation: 'HON'
      },
      {
        name: 'Health and Physical Education',
        abbreviation: 'HPE'
      },
      {
        name: 'Intensive English Program',
        abbreviation: 'IEP'
      },
      {
        name: 'Intercultural Experience',
        abbreviation: 'IE'
      },
      {
        name: 'Interdisciplinary Studies',
        abbreviation: 'IDS'
      },
      {
        name: 'Industrial Hygiene',
        abbreviation: 'IH'
      },
      {
        name: 'Journalism',
        abbreviation: 'JN'
      },
      {
        name: 'Latin',
        abbreviation: 'LT'
      },
      {
        name: 'Learning Communities',
        abbreviation: 'LC'
      },
      {
        name: 'Mathematics',
        abbreviation: 'MA'
      },
      {
        name: 'Management',
        abbreviation: 'MG'
      },
      {
        name: 'Marketing',
        abbreviation: 'MK'
      },
      {
        name: 'Military Science',
        abbreviation: 'MS'
      },
      {
        name: 'Music',
        abbreviation: 'MU'
      },
      {
        name: 'Nursing',
        abbreviation: 'NU'
      },
      {
        name: 'Physics',
        abbreviation: 'PH'
      },
      {
        name: 'Philosophy',
        abbreviation: 'PHL'
      },
      {
        name: 'Public Relations',
        abbreviation: 'PR'
      },
      {
        name: 'Political Science',
        abbreviation: 'PS'
      },
      {
        name: 'Psychology',
        abbreviation: 'PY'
      },
      {
        name: 'Quantitative Methods',
        abbreviation: 'QM'
      },
      {
        name: 'Religion',
        abbreviation: 'RE'
      },
      {
        name: 'Radio-Television-Film',
        abbreviation: 'RTF'
      },
      {
        name: 'Robotics and Technology Park',
        abbreviation: 'RTP'
      },
      {
        name: 'Study Abroad',
        abbreviation: 'SA'
      },
      {
        name: 'Science Education',
        abbreviation: 'SCED'
      },
      {
        name: 'Security and Emergency Management',
        abbreviation: 'SEM'
      },
      {
        name: 'Service Learning',
        abbreviation: 'SL'
      },
      {
        name: 'Sociology',
        abbreviation: 'SO'
      },
      {
        name: 'Spanish',
        abbreviation: 'SP'
      },
      {
        name: 'Sport and Recreation Management',
        abbreviation: 'SRM'
      },
      {
        name: 'Social Work',
        abbreviation: 'SW'
      },
      {
        name: 'Theatre',
        abbreviation: 'TH'
      },
      {
        name: 'University Experience',
        abbreviation: 'UNA'
      },
      {
        name: 'Women\'s Studies,
        abbreviation: 'WS'
      }
    ];
    async.each(subjects, function(subject, cb) {
      new db.models.Subject(subject).save(function(err) {
        cb();
      });
    }, function() {
      callback();
    });
  },
  // initialize general requirement areas
  function(callback) {
    areas = [
      {
        name: 'Written Composition',
        area: 'I'
      },
      {
        name: 'Humanities and Fine Arts',
        area: 'II'
      },
      {
        name: 'Natural Sciences and Mathematics',
        area: 'III'
      },
      {
        name: 'History, Social and Behavioral Sciences',
        area: 'IV'
      },
      {
        name: 'Additional Requirements',
        area: 'V'
      },
    ];
    async.each(areas, function(area, cb) {
      new db.models.GeneralRequirement(area).save(function(err) {
        cb();
      });
    }, function() {
      callback();
    });
  },
], function() {
  console.log("Ok I'm done.");
});
