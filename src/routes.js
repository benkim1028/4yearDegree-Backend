const express = require('express');
const router = express.Router();

const FacultySchema = require('./models/faculty');
const FacultyController = require('./controllers/facultyController');
const parse5 = require('parse5');

router.get('/faculty', (req,res) => {
    FacultySchema.find({}, (err,data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
});

router.post('/faculty', (req,res) => {
    let facultyController = new FacultyController();

    facultyController.httpGetAsync('http://www.calendar.ubc.ca/vancouver/index.cfm?tree=12,0,0,0', function(data) {
        let document = parse5.parse(data);
        let hreflist = [];
        facultyController.searchRecursively(document, "href", hreflist);

        let processList = [];

        for (let i=0; i < hreflist.length; i++) {
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

module.exports = router;