// **********************************************************

'use strict';

// **********************************************************
// require 

var http = require("http");
var https = require("https");
var url = require('url');
var express = require('express');
var exphbs = require('express-handlebars');
var request = require('request');

var path = require('path');
// var fsr = require('file-stream-rotator');
var fs = require('fs');
var morgan = require('morgan');
var cors = require('cors');
// var Memcached = require('memcached');
var async = require('async');
var helmet = require('helmet');

var bodyparser = require('body-parser');
var package_json = require('./package.json');

var dotenv = require('dotenv').load();


// **********************************************************
// config

//var configEnv = require('./config/env.json');

var NODE_ENV = process.env.NODE_ENV;
console.log('NODE_ENV : ' + NODE_ENV);

//var NODE_PORT =  process.env.NODE_PORT
var NODE_PORT = process.env.PORT;

// **********************************************************
// console start

console.log('package_json.name : ' + package_json.name);
console.log('package_json.version : ' + package_json.version);
console.log('package_json.description : ' + package_json.description);
// console.log('ElastiCache EndPoint: '+process.env.ELASTICACHE_ENDPOINT);

//console.log('NODE_PORT : '+ NODE_PORT );
//console.log('PG_DB : '+ PG_DB );

// **********************************************************
// app

var app = express();

app.use(cors());
app.use(helmet());

// **********************************************************
// Handlebars templates

app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main', layoutsDir: './src/views/layouts', partialsDir: './src/views/partials' }));
app.set('view engine', '.hbs');
app.set('views', './src/views');

/*var memcached = new Memcached(process.env.ELASTICACHE_ENDPOINT);
var memcached_lifetime = Number(process.env.ELASTICACHE_LIFETIME);
var cached_param = 'outputcache';
*/
// **********************************************************
// log

var logDirectory = __dirname + '/log';

/*fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

var accessLogStream = fsr.getStream({
    filename: logDirectory + '/fcc-pdf-%DATE%.log',
    frequency: 'daily',
    verbose: false
});

app.use(morgan('combined', {stream: accessLogStream}))*/

// **********************************************************
// parser

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));


// **********************************************************
// route

app.use('/', express.static(__dirname + '/public'));

// GeoServer route
app.use('/', function(req, res, next) {
    var geoURL = process.env.GEO_HOST + '/' + process.env.GEO_SPACE;
    var reqURL = geoURL + req.url;

    if (req.url.split('/gwc').length > 1) {
        req.pipe(request(reqURL)).pipe(res);
    } else {
       next(); 
    }
});

app.get(['/', '/deployment'], function(req, res) {
    res.render('mainView', {
        title: 'Deployment',
        activeDeploy: 'active'
    });
});

app.get(['/speed'], function(req, res) {
    res.render('mainView', {
        title: 'Speed',
        activeSpeed: 'active'
    });
});

app.get(['/technology'], function(req, res) {
    res.render('mainView', {
        title: 'Technology',
        activeTech: 'active'
    });
});

app.get(['/providers'], function(req, res) {
    res.render('mainView', {
        title: 'Providers',
        activeProv: 'active'
    });
});



// **********************************************************
// error

app.use(function(req, res) {

    var err_res = {};

    err_res.responseStatus = {
        'status': 404,
        'type': 'Not Found',
        'err': req.url + ' Not Found'
    };

    res.status(404);
    res.sendFile('404.html', { root: __dirname + '/public' });
    // res.send(err_res);    
});

app.use(function(err, req, res, next) {

    //console.log('\n app.use error: ' + err );
    console.error(err.stack);

    var err_res = {};
    err_res.responseStatus = {
        'status': 500,
        'type': 'Internal server error.',
        'err': err.name + ': ' + err.message
    };

    res.status(500);
    res.sendFile('500.html', { root: __dirname + '/public' });
    // res.send(err_res);
});

process.on('uncaughtException', function(err) {
    //console.log('\n uncaughtException: '+ err);
    console.error(err.stack);
});

// **********************************************************
// server

var server = app.listen(NODE_PORT, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log('\n  listening at http://%s:%s', host, port);

});

module.exports = app;
