// app/models/bear.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var WordSchema   = new Schema({
    sentence: String,
    translation: String,
    language: String
});

module.exports = mongoose.model('Word', WordSchema);