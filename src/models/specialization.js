/**
 * Created by ENVY on 2017-03-19.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SpecializationSchema = new Schema({
    name: {required: true, type: String},
    major: {required: true, type: String}
});

module.exports = mongoose.model('Department', DepartmentSchema);
