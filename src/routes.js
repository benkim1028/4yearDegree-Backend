const express = require('express');
const router = express.Router();

const FacultySchema = require('./models/faculty');
const DepartmentSchema = require('./models/department');
const MajorSchema = require('./models/major');
const CourseSchema = require('./models/course');
const FacultyController = require('./controllers/facultyController');
const DepartmentController = require('./controllers/DepartmentController');
const MajorController = require('./controllers/MajorController');
const CourseController = require('./controllers/CourseController');
const parse5 = require('parse5');
const async = require('async');

router.get('/faculty', (req, res) => {
    FacultySchema.find({}, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
});
router.get('/course', (req, res) => {
    CourseSchema.find({}, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
});
router.get('/:facultyID', (req, res) => {
    console.log(req.params);
    DepartmentSchema.find({faculty: decodeURI(req.params.facultyID)}, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
});
router.get('/:facultyID/:departmentID', (req, res) => {
    console.log(req.params);
    MajorSchema.find({department: decodeURI(req.params.departmentID)}, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
});
router.get('/:facultyID/:departmentID/:majorID', (req, res) => {
    console.log(req.params);
    CourseSchema.find({major: decodeURI(req.params.majorID)}).sort('code').exec((err, data) => {
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
    FacultySchema.find({}).then(function (faculties) {
        let processList = [];
        let processList2 = [];
        let departmentController = new DepartmentController();
        faculties.forEach(function (faculty) {
            processList.push(
                departmentController.httpGetAsync(faculty.href, function (data) {
                    let document = parse5.parse(data);
                    let hreflist = [];
                    departmentController.searchRecursively(document, "href", hreflist);
                    for (let i = 0; i < hreflist.length; i++) {
                        let departmentSchema = new DepartmentSchema();

                        departmentSchema.name = hreflist[i].name;
                        departmentSchema.href = hreflist[i].link;
                        departmentSchema.faculty = faculty.name;

                        processList2.push(
                            departmentSchema.save().then((data) => {
                                console.log("successfully saved department with data name: " + data.name);
                            })
                        )
                    }
                })
            )
        });
        Promise.all(processList).then(() => {
            Promise.all(processList2).then(() => {
                res.send('success');
            })
        })
    })
});

router.post('/major', (req, res) => {
    let processList = [];
    let processList2 = [];
    let processList3 = [];
    staticModel.getAllFaculties().then((data) => {
        let keys = Object.keys(data);// "Land and Food Systems", "Arts", "Education", "Medicine", "Applied Science", "Science", "Commerce and Business Administration", "Forestry", "Dentistry", "Arts Commuter Transition Program"
        let majorlist = [];
        keys.forEach(function (key) {
            data[key].forEach(function (one) {
                majorlist.push(one.course);
            });
        });
        processList3.push(
            DepartmentSchema.find({}).then(function (departments) {

                departments.forEach(function (department) {
                    let majorController = new MajorController();
                    processList.push(
                        majorController.httpGetAsync(department.href, function (data) {
                            let document = parse5.parse(data);
                            let hreflist = [];
                            majorController.searchRecursively(document, "href", hreflist);
                            for (let i = 0; i < hreflist.length; i++) {
                                let majorSchema = new MajorSchema();
                                if (majorlist.includes(hreflist[i].name)) {
                                    majorSchema.name = hreflist[i].name;
                                    majorSchema.href = hreflist[i].link;
                                    majorSchema.department = department.name;
                                    processList2.push(
                                        majorSchema.save().then((data) => {
                                            console.log("successfully saved major with data name: " + data.name);
                                        })
                                    );
                                }
                            }

                        })
                    )
                })

            })
        );
        Promise.all(processList3).then(() => {
            Promise.all(processList).then(() => {
                Promise.all(processList2).then(() => {
                    res.send('success');
                });
            });
        });
    });
});

router.post('/course', (req, res) => {
    let courseController = new CourseController();
    let processList = [];
    let processList2 = [];
    let processList3 = [];

    staticModel.getAllFaculties().then((data) => {
        let keys = Object.keys(data);// "Land and Food Systems", "Arts", "Education", "Medicine", "Applied Science", "Science", "Commerce and Business Administration", "Forestry", "Dentistry", "Arts Commuter Transition Program"
        let snamelist = [];
        let majorList = [];
        keys.forEach(function (key) {
            data[key].forEach(function (one) {
                snamelist.push(one.sName);
                majorList.push(one.course);
            });
        });
        snamelist.forEach(function (eachsName) {
            let URLofDept = 'https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=1&dept=' + eachsName;
            processList.push(
                courseController.httpGetAsync(URLofDept, function (data) {
                    for (let eachdata of data) {
                        let URLofCourse = "https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=3&dept=" + eachdata.dept + "&course=" + eachdata.number;
                        processList2.push(
                            courseController.httpGetAsync2(URLofCourse, function (coursedata) {
                                let courseSchema = new CourseSchema();
                                courseSchema.name = eachdata.fullname;
                                courseSchema.code = eachdata.section;
                                courseSchema.credit = Number(coursedata[0]);
                                let k = snamelist.indexOf(eachsName);
                                courseSchema.major = majorList[k];

                                processList3.push(
                                    courseSchema.save().then((data) => {
                                        console.log("successfully saved course with data name: " + data.name);
                                    })
                                )
                            })
                        )
                    }
                })
            );
        });
        Promise.all(processList).then(() => {
            Promise.all(processList2).then(() => {
                Promise.all(processList3).then(() => {
                    console.log("yay")
                    res.send('success');
                });
            });
        });
    });
});
const StaticModel = require('./models/StaticModel');
let staticModel = new StaticModel();

router.post('/static', (req, res) => {
    staticModel.getAllFaculties().then((data) => {
        res.send(data);
    });
});

module.exports = router;