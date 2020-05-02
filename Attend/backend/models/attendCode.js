var mongoose = require('mongoose');
var AttendSchema = new mongoose.Schema({
    code: String,

});

const AttendCode = mongoose.model('AttendCollection',AttendSchema);

module.exports = AttendCode ;
