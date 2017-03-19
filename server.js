const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const PORT = 3001;

const url = 'mongodb://interval:interval123@ds135700.mlab.com:35700/interval';
const options = {promiseLibrary: require('bluebird')};
mongoose.Promise = global.Promise;
mongoose.connect(url, options);

mongoose.connection.on('connected', () => {
    console.log('Database connected');
});

mongoose.connection.on('error', (err) => {
    console.log('Database error: ' + err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Database disconnected');
});



// Set body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

const router = require('./src/routes');
app.use('/api', router);

app.listen(PORT, () => {
    console.log('api running on PORT: ' + PORT);
});


