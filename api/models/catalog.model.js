/***																					***\

	Filename: api/models/catalog.model.js
	Authors: Tyler Yasaka

\***																					***/

var mongoose = require('mongoose');

var models = {};

// admins
var adminSchema = mongoose.Schema({
    username: String,
    password: String,
    privilege: Number,
    apps: [String]
});
models.Admin = mongoose.model('Admin', adminSchema);

// textSections
var textSectionSchema = mongoose.Schema({
    title: String,
    content: String
});
models.TextSection = mongoose.model('TextSection', textSectionSchema);

// export the models object for inclusion in other scripts
module.exports = {
	mongoose: mongoose,
	models: models
};
