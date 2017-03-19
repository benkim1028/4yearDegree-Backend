const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    name: {required: true, type: String},
    code: {typeNumber: Number},
    major: {required: true, type:String},
    prereq: [{type: Schema.Types.ObjectId, ref: 'Course'}]
});

module.exports = mongoose.model('Course', CourseSchema);
