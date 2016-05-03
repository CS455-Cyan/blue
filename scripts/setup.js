/***                                          ***\

  Filename: scripts/initializeDatabase.js
  Authors:
      Tyler Yasaka
      Andrew Fisher

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
      // fill in the rest!
      {
        name: '',
        abbreviation: ''
      },
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
