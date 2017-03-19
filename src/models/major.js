const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MajorSchema = new Schema({
    name: {required: true, type: String},
    href: {required: true, type: String},
    department: {required: true, type: String},
    year: [{level: {type: Number}, courses:[{}]}]
});

module.exports = mongoose.model('Major', MajorSchema);
