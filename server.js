const express = require('express');
const mongoose = require('mongoose');
const Student = require('./models/student');

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/attendanceDB')
.then(() => console.log("Database connected"))
.catch(err => console.log(err));

// Test route
app.get('/', (req, res) => {
    res.send("Attendance Tracker Running");
});

// Add student (simple test)
app.get('/addStudent', async (req, res) => {
    try {
        const student = new Student({
            name: "Rahul",
            roll: 101,
            marks: 85,
            attendance: { present: 20, total: 25 }
        });

        await student.save();
        res.send("Student added successfully");
    } catch (err) {
        res.send(err);
    }
});

// View students
app.get('/students', async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

// Update attendance
app.get('/updateAttendance', async (req, res) => {
    try {
        const student = await Student.findOne({ roll: 101 });

        student.attendance.present += 1;
        student.attendance.total += 1;

        await student.save();

        res.send("Attendance updated");
    } catch (err) {
        res.send(err);
    }
});

// Get attendance percentage
app.get('/attendancePercent', async (req, res) => {
    const student = await Student.findOne({ roll: 101 });

    const percent = (student.attendance.present / student.attendance.total) * 100;

    res.send("Attendance: " + percent.toFixed(2) + "%");
});

// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});