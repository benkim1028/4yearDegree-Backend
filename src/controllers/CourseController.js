/**
 * Created by ENVY on 2017-03-18.
 */
let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let parse5 = require('parse5');

class CourseController {



    constructor() {
        this.counter = false;
    }

    httpGetAsync(theUrl, callback) { //theURL or a path to file
        let httpRequest = new XMLHttpRequest();
        let that = this;
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                let data = parse5.parse(httpRequest.responseText);
                let array = [];

                that.searchRecursively(data, 'class', "'section1'", "'section2'", array);

                let info = [];

                array.forEach((a) => {
                    that.getInfo(a, info);
                });

                let dataset = [];

                for (let i=0; i < info.length; i++) {
                    let obj = {};

                    obj.section = info[i];
                    obj.fullname = info[i+1];
                    obj.dept = info[i].split(" ")[0];
                    obj.number = info[i].split(" ")[1];

                    dataset.push(obj);
                    i++;
                }



                callback(dataset);

            }
        };

        httpRequest.open('GET', theUrl, true);
        httpRequest.send(null);
    }
    httpGetAsync2(theUrl, callback) { //theURL or a path to file
        let httpRequest = new XMLHttpRequest();
        let that = this;
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                let data = parse5.parse(httpRequest.responseText);
                let array = [];

                that.searchRecursively2(data, array);

                console.log(array);
                callback(array);

            }
        };

        httpRequest.open('GET', theUrl, true);
        httpRequest.send(null);
    }

    getInfo(node, array) {
        if (typeof node.value !== "undefined") {
            if (node.value.trim() != "") {
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
    searchRecursively2(node, list){
        if (typeof node.value !== "undefined") {
            if(node.value.trim() !== ""){
                if(node.value.trim().includes("Credits:")){
                    list.push(node.value.trim().replace('Credits:', "").trim());
                }
                // if(node.value.trim().includes("Pre-reqs:")){
                //     list.push(node.value.trim())
                // }
            }
        }

        if (typeof node.childNodes !== "undefined") {
            for(let child of node.childNodes) {
                this.searchRecursively2(child, list);
            }
        }
    }


}

module.exports = CourseController;