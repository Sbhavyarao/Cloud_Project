var mongoose = require('mongoose');
var SyllabusSchema = new mongoose.Schema({
    userId: String,

});

const Syllabus = mongoose.model('SyllabusCollection',SyllabusSchema);

module.exports = Syllabus ;
