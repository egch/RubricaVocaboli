//code adapted from https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var Word     =  require('./app/models/word');
var auth = require('./app/utils/auth');
var validator = require('validator');



// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// basic authentication hard-coded
//app.use(basicAuth('username', 'password'));


mongoose.connect('mongodb://localhost/rubricavocaboli');


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router


router.route('/words')
.get(function(request, response )
{
 Word.find(function(err, words) {
            if (err){
             console.log("err: "+err);
             response.send(err);
             }
            response.json(words);
        });
})
.post(function(request, response) {
         var word = new Word();
         word.sentence = request.body.sentence;
         word.translation = request.body.translation;
         word.language = request.body.language;
         console.log("creating new word with - sentence: "+word.sentence+" - translation: "+word.translation+" - language: "+word.language);
         if(!(validator.isLength(word.sentence, 2, 30)&&
              validator.isLength(word.translation, 2, 30)&&
              validator.isLength(word.language, 2, 2)))
             {
                throw "Validation error";
             }

         word.save(function(err) {
             if (err) {
                 console.log("err: "+err);
                 response.send(err);
                 }
             response.json({ message: 'Word created!' });
         });

     });


router.route('/words/:word_id')
    .get(function(request, response) {
        Word.findById(request.params.word_id, function(err, word) {
            if (err) {
             console.log("err: "+err);
             response.send(err);
            }
            response.json(word);
        })
     }).
     delete(function(request, response)
     {
         Word.remove({_id:request.params.word_id},
         function(err, word)
         {
         if(err) {
            console.log("err: "+err);
            response.send(err);
            }
         response.json({message: 'word deleted'});
         });
     });

//for search like
router.route('/wordslike/:word')
.get(function(request, response) {
        var word = request.params.word;
        console.log("search like: "+word);
        Word.find({'sentence' : new RegExp(word, 'i')}, function(err, words){
           if (err) {response.send(err);}
           response.json(words);
        });
     });
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
app.use('/api', router);


// START THE SERVER
// =============================================================================
var port = process.env.PORT || 8090;        // set our port
app.listen(port);
console.log('serving at http://localhost:8090/api/words');
