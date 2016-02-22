var express    = require('express');
var validator = require('validator');

var Word =  require('../models/Word');


var app = express();
var router = express.Router();

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
     })
.delete(function(request, response) {
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

module.exports = router;