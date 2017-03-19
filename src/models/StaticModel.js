
let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const parse5 = require('parse5');

class StaticModel {

    getAllFaculties() {
        return new Promise((resolve, reject) => {
            try {
                let url = 'https://courses.students.ubc.ca/cs/main?pname=subjarea';
                let httpRequest = new XMLHttpRequest();
                let that = this;
                httpRequest.onreadystatechange = function() {
                    if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                        let data = parse5.parse(httpRequest.responseText);
                        let array = [];
                        that.searchRecursively(data, 'class', "'section1'", "'section2'", array);

                        let info = [];
                        array.forEach(function (a) {
                            that.getInfo(a, info);
                        });

                        let dataset = [];

                        for (let i = 0; i < info.length; i = i + 2) {
                            if (info[i+1].includes('Faculty of')) {
                                let fac = (info[i + 1]).replace('Faculty of', '').trim();

                                if (fac == 'Comm and Bus Admin') {
                                    fac = 'Commerce and Business Administration'
                                }

                                let cour = info[i];
                                if (cour.includes('Business Administration')) {
                                    cour = (info[i]).replace('Business Administration:', '').trim();
                                }

                                let obj = {
                                    course: cour,
                                    faculty: fac
                                };

                                dataset.push(obj);
                            }
                        }

                        let groups = {};
                        for (let i=0; i < dataset.length; i++) {
                            let item = dataset[i];

                            if (!groups[item.faculty]) {
                                groups[item.faculty] = [];
                            }

                            groups[item.faculty].push(item.course);
                        }

                        resolve(groups);
                    }
                };
                httpRequest.open('GET', url, true);
                httpRequest.send(null);
            } catch (err) {
                reject(err);
            }
        });
    }

    searchRecursively(node, name, value1, value2, list){
        if (typeof node.attrs !== "undefined") {
            for (let attribute of node.attrs) {
                if(attribute.name == name && (attribute.value == value1 || attribute.value == value2)){
                    list.push(node);
                }
            }
        }

        if (typeof node.childNodes !== "undefined") {
            for(let child of node.childNodes) {
                this.searchRecursively(child, name, value1, value2, list);
            }
        }
    }

    getInfo(node, array) {
        if (typeof node.value !== "undefined") {
            if (node.value.trim() != ""  && node.value.trim().length > 4) {
                array.push(node.value.trim());
            }
        }

        if (typeof node.childNodes !== "undefined") {
            let that = this;
            node.childNodes.forEach(function (child) {
                that.getInfo(child, array);
            });
        }
    }

}


module.exports = StaticModel;