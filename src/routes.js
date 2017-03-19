const express = require('express');
const router = express.Router();

const FacultySchema = require('./models/faculty');

router.get('/', (req,res) => {
    res.json({message: "connected"});
});

router.post('/faculty', (req,res) => {
    let facultySchema = new FacultySchema();

    facultySchema.name = req.body.name;
    facultySchema.href = req.body.href;

    facultySchema.save().then((faculty) => {
        console.log("successfully saved faculty with id: " + faculty._id);
        res.send(faculty);
    }).catch((err) => {
        console.log("error saving faculty: " + err);
    });
});

module.exports = router;