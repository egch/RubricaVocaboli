//code adapted from https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4

// call the packages we need
var express    = require('express');        // call express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var auth = require('./app/utils/auth');

var blocks = require('./app/controllers/WordController');

var app = express();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/rubricavocaboli');


app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

//authentication layer
app.use(function(req, res, next){
        console.log(req.url);
        return  auth.basicAuth(req,res,next);
});
//routes layer
app.use('/api', blocks);


// START THE SERVER
// =============================================================================
var port = process.env.PORT || 8090;        // set our port
app.listen(port);
console.log('serving at http://localhost:8090/api/words');
