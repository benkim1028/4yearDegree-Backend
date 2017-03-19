const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FacultySchema = new Schema({
    name: {required: true, type: String},
    href: {required: true, type: String}
});

module.exports = mongoose.model('Faculty', FacultySchema);
