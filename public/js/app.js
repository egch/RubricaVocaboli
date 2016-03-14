var rubricaApp = angular.module('rubrica', ['ngRoute', 'ngResource']);

rubricaApp.factory('Word', ['$resource', function($resource){
   return  $resource('http://localhost:8090/api/words/:_id', null,
   {
        'update': {method:'PUT'}
   });
 }]);


/* ********** controller section ********** */

rubricaApp.controller('ListWordsController',
    function ($scope, Word) {


        Word.query(function(data) {
            $scope.data = data;
        },
        function(error)
        {
            console.log('error: '+error);
            $location.path('/error');
        });
});


rubricaApp.controller('DeleteWordController',
    function ($scope, Word, $routeParams, $location) {
        var result = confirm("Are you sure you want to delete this element?")
        if(result)
        {
            Word.delete({_id:$routeParams._id}, function()
            {
                $location.path('/words');
            },
            function(error)
           {
               $location.path('/error');
           });
       }
});

rubricaApp.controller('NewWordController',
    function ($scope, Word, $location) {
      $scope.save = function() {
        console.log('word: '+$scope.word.sentence);
        Word.save($scope.word, function()
         {
             $location.path('/words');

         },function(error)
         {
             console.log('error: '+error.message);
             $location.path('/error');
         });
      }
});

rubricaApp.controller('EditWordController',
    function ($scope,  $routeParams, Word, $location) {
        $scope.load = function() {
            console.log("Invocated update with _id: "+$routeParams._id);
            Word.get({_id:$routeParams._id}, function (data) {
                $scope.word = data;
            });
        };
        $scope.save = function() {
            Word.update({_id:$scope.word._id}, $scope.word, function(success)
            {
                 $location.path('/words');
            });
        };
        $scope.load()

});



/* ********** ngRoute section ********** */

rubricaApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'views/home.html'
            }).
            when('/words', {
                controller:  'ListWordsController',
                templateUrl: 'views/listWords.html'
            }).
            when('/word/:_id/delete', {
                controller:  'DeleteWordController',
                templateUrl: 'views/home.html'
            }).
            when('/word/:_id/edit', {
               controller:  'EditWordController',
               templateUrl: 'views/word-edit.html'
           }).
            when('/newWord', {
                 controller: 'NewWordController',
                templateUrl: 'views/word-new.html'
            }).
            when('/error', {
                templateUrl: 'views/error.html'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);
