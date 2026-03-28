const express = require('express');
const mongoose = require('mongoose');
const Student = require('./models/student');
const path = require('path');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/attendanceDB')
.then(() => console.log("Database connected"))
.catch(err => console.log(err));

// Serve UI
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Add / Update student
app.post('/addStudentUI', async (req, res) => {
    try {
        const { name, roll, subject } = req.body;

        const cleanSubject = subject.toLowerCase().trim(); // 🔥 fix

        let student = await Student.findOne({ roll: Number(roll) });

        if (!student) {
            student = new Student({
                name,
                roll: Number(roll),
                subjects: {}
            });
        }

        if (!student.subjects[cleanSubject]) {
            student.subjects[cleanSubject] = { present: 0, total: 0 };
            student.markModified('subjects'); // 🔥 VERY IMPORTANT
        }

        await student.save();
        res.send("Saved");
    } catch (err) {
        res.send(err);
    }
});

// Get students
app.get('/students', async (req, res) => {
    const data = await Student.find();
    res.json(data);
});

// Mark attendance
app.get('/mark', async (req, res) => {
    const { roll, subject, type } = req.query;

    const cleanSubject = subject.toLowerCase().trim(); // 🔥 fix

    const student = await Student.findOne({ roll: Number(roll) });

    if (!student || !student.subjects[cleanSubject]) {
        return res.send("Invalid");
    }

    student.subjects[cleanSubject].total += 1;

    if (type === "present") {
        student.subjects[cleanSubject].present += 1;
    }

    student.markModified('subjects'); // 🔥 VERY IMPORTANT

    await student.save();
    res.send("Updated");
});

// Delete student
app.get('/deleteStudent', async (req, res) => {
    await Student.deleteOne({ roll: Number(req.query.roll) });
    res.send("Deleted");
});

app.listen(3000, () => console.log("Server running on port 3000"));