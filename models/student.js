const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: String,
    roll: Number,
    subjects: Object
});

module.exports = mongoose.model('Student', studentSchema);