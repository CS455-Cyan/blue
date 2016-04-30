// throw away code

/*
  Test: generateCatalogHTML
  Description: test generateCatalogHTML function
  Created: Tyler Yasaka 04/29/2016
  Modified:
*/

var db = require('../../models/catalog.model');

var definitions = require('../../routes/catalog/definitions.js');
var fs = require('fs');

db.connection.on('admin', function() {
  var year = {start: "2016", end: "2017"};
  definitions.generateCatalogHTML(year, function(html) {
    fs.writeFileSync(__dirname + "/catalog.html", html);
    console.log("done, output in catalog.html");
  });
});
