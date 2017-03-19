## Intervol Backend

1. Run npm install
2. Run npm start or npm run start-dev to run with nodemon
3. Open [localhost](http://localhost:3001/api)

function async() {
    let hreflist = [];
    return new Promise(function (fulfill, reject) {
        httpGetAsync('http://www.calendar.ubc.ca/vancouver/index.cfm?tree=12,0,0,0', function (data) {
            document = parse5.parse(data);
            console.log(document);
            searchRecursively(document, "href", hreflist);
            console.log(hreflist);
            fulfill(hreflist);
        });
    }).catch(reject(console.log("do nothing")))
}
