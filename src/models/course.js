const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    name: {required: true, type: String},
    code: {typeNumber: Number},
    prereq: [{type: Schema.Types.ObjectId, ref: 'Course'}]
});

module.exports = mongoose.model('Course', CourseSchema);
