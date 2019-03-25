var mongoose = require('mongoose');

var studentSchema = mongoose.Schema({
    name: String,
    snum: Number,
    finalPercentage: Number,
    finalGrade: String,
});

var Student = mongoose.model('Student', studentSchema);
module.exports = Student;