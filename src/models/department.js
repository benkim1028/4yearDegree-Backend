const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
    name: {required: true, type: String},
    href: {required: true, type: String},
    faculty: {required: true, type: String}
});

module.exports = mongoose.model('Department', DepartmentSchema);
