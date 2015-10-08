//code adapted from https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/rubricavocaboli');
var Word     = require('./app/models/word');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router


router.route('/words')
.get(function(request, response)
{
 Word.find(function(err, words) {
            if (err)
                response.send(err);

            response.json(words);
        });
})
.post(function(request, response) {
         var word = new Word();
         word.sentence = request.body.sentence;
         word.translation = request.body.translation;
         word.language = request.body.language;

         word.save(function(err) {
             if (err)
                 response.send(err);

             response.json({ message: 'Word created!' });
         });
     });


router.route('/words/:word_id')
    .get(function(request, response) {
        Word.findById(request.params.word_id, function(err, word) {
            if (err)
                response.send(err);
            response.json(word);
        })
     }).
     delete(function(request, response)
     {
     Word.remove({_id:request.params.word_id},
     function(err, word)
     {
     if(err)
        response.send(err);
     response.json({message: 'word deleted'});
     });
     });


app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
console.log('access with http://localhost:8080/api/words');
