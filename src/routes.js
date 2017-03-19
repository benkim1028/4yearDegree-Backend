const express = require('express');
const router = express.Router();

const FacultySchema = require('./models/faculty');
const DepartmentSchema = require('./models/department');
const FacultyController = require('./controllers/facultyController');
const DepartmentController = require('./controllers/DepartmentController');
const parse5 = require('parse5');

router.get('/faculty', (req, res) => {
    FacultySchema.find({}, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
});
router.get('/department', (req, res) => {
    DepartmentSchema.find({}, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
});

router.post('/faculty', (req, res) => {
    let facultyController = new FacultyController();

    facultyController.httpGetAsync('http://www.calendar.ubc.ca/vancouver/index.cfm?tree=12,0,0,0', function (data) {
        let document = parse5.parse(data);
        let hreflist = [];
        facultyController.searchRecursively(document, "href", hreflist);
        // res.send(hreflist);
        let processList = [];

        for (let i = 0; i < hreflist.length; i++) {
            let facultySchema = new FacultySchema();

            facultySchema.name = hreflist[i].name;
            facultySchema.href = hreflist[i].link;

            processList.push(
                facultySchema.save().then((data) => {
                    console.log("successfully saved faculty with data name: " + data.name);
                })
            );
        }

        Promise.all(processList).then(() => {
            res.send('success');
        });

    });
});

router.post('/department', (req, res) => {
    let processList = [];
    let processList2 = [];
    FacultySchema.find({}).then(function (faculties) {
        processList.push(
            faculties.forEach(function (faculty) {
                let departmentController = new DepartmentController();
                departmentController.httpGetAsync(faculty.href, function (data) {
                    let document = parse5.parse(data);
                    let hreflist = [];
                    departmentController.searchRecursively(document, "href", hreflist);
                    for (let i = 0; i < hreflist.length; i++) {
                        let departmentSchema = new DepartmentSchema();

                        departmentSchema.name = hreflist[i].name;
                        departmentSchema.href = hreflist[i].link;

                        processList2.push(
                            departmentSchema.save().then((data) => {
                                console.log("successfully saved department with data name: " + data.name);
                            })
                        );
                    }

                });
            })
        )
        Promise.all(processList).then((data) => {
            console.log(data);
            res.send('success');
        })
    })
});

module.exports = router;