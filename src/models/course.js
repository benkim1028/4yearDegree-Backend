const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    name: {required: true, type: String},
    code: {required: true, type: String},
    major: {type:String},
    credit: {type:Number},
    prereq: {type: String}
});

module.exports = mongoose.model('Course', CourseSchema);
