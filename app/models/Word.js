
var mongoose     = require('mongoose');

// Create the MovieSchema.
var WordSchema = new mongoose.Schema({
  sentence: {
    type: String,
    required: true
  },
  translation: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'EN'
  }
});

module.exports = mongoose.model('Word', WordSchema);
