var express    = require('express');
var validator = require('validator');

var Word =  require('../models/Word');


var app = express();
var router = express.Router();


//BEGIN - rest
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
              validator.isLength(word.translation, 2, 30)))
             {
                throw "Validation error";
             }

         word.save(function(err) {
             if (err) {
                 console.log("err: "+err);
                 response.send(err);
                 }
             //change timeout from 0 to 2000 to see the promise in action on angular
             setTimeout(function(){response.json({message: 'word has been created'})}, 0);
         });

 });


router.route('/words/:word_id')
.get(function(request, response) {
        Word.findById(request.params.word_id, function(err, word) {
            if(word == null)
            {response.json("word with _id "+request.params.word_id+" does not exist");
            return;
            }
            if (err) {
             console.log("err: "+err);
             response.send(err);
            }
            response.json(word);
        })
     })
 .put(function(request, response) {
         Word.findByIdAndUpdate({_id: request.params.word_id}, request.body, function(err, word)
         {
                 if(err) {
                     console.log("err: "+err);
                     response.json("Failing updating word having _id: "+request.params.word_id);
                    }
                    else
                    {
                        if(word!=null)
                            {response.json("word with _id "+request.params.word_id+" has been successfully updated")}
                        else
                            {response.json("word with _id "+request.params.word_id+" does not exist")}
                    }
                 });
      })
.delete(function(request, response) {
         Word.findByIdAndRemove({_id:request.params.word_id},
         function(err, word)
         {
         if(err) {
             console.log("err: "+err);
             response.json("Failing delete word having _id: "+request.params.word_id);
            }
            else
            {
                if(word!=null)
                    {response.json("word with _id "+request.params.word_id+" has been successfully deleted")}
                else
                    {response.json("word with _id "+request.params.word_id+" does not exist")}
            }
         });
     });
//END - rest

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