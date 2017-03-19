/**
 * Created by ENVY on 2017-03-18.
 */

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var fs = require("fs");
const parse5 = require('parse5');


function httpGetAsync(theUrl, callback) { //theURL or a path to file
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var data = httpRequest.responseText;  //if you fetch a file you can JSON.parse(httpRequest.responseText)
            if (callback) {
                callback(data);
            }
        }
    };

    httpRequest.open('GET', theUrl, true);
    httpRequest.send(null);
}
var document;
httpGetAsync('http://www.calendar.ubc.ca/vancouver/index.cfm?tree=12,0,0,0', function(data) {
    document = parse5.parse(data);
    searchRecursively(document, "href", hreflist);
    console.log(hreflist);
});
var hreflist = [];
var counter = 0;

function searchRecursively(node, name, list){
    let newRegex = new RegExp("^index.cfm\\?tree=[0-9]\\S*");
    let newRegex2 = new RegExp("[a-z]+(\\s|[a-z])*")
    if (typeof node.attrs !== "undefined") {
        for (let attribute of node.attrs) {
            if (attribute.name == name && newRegex.test(attribute.value) && newRegex2.test(node.childNodes[0].value)) {
                let name = node.childNodes[0].value;
                let link = "http://www.calendar.ubc.ca/vancouver/" + attribute.value;
                let newobject = {};
                newobject["name"] = name;
                newobject["link"] = link;
                if (counter >= 10)
                    hreflist.push(newobject);
                counter++;
            }
        }
    }

    if (typeof node.childNodes !== "undefined") {
        let that = this;
        for(let child of node.childNodes) {
            searchRecursively(child, name, list);
        }
    }
}
