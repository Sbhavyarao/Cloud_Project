var mongoose = require('mongoose');

var CoursesSchema = new mongoose.Schema({
    userId: String,
    courseList: [],
    updated_date: {type: Date, default: Date.now},
});
const Course = mongoose.model('CourseCollection',CoursesSchema);
module.exports = Course ;
