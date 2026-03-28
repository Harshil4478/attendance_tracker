const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: String,
    roll: Number,
    marks: Number,
    attendance: {
        present: Number,
        total: Number
    }
});

module.exports = mongoose.model('Student', studentSchema);