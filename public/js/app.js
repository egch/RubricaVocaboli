var rubricaApp = angular.module('rubrica', ['ngRoute', 'ngResource']);


rubricaApp.factory('Word', function($resource, $http){
    //authentication BASIC username/password
    $http.defaults.headers.common['Authorization'] = 'basic dXNlcm5hbWU6cGFzc3dvcmQ=';
    return  $resource('http://localhost:8090/api/words/:_id')
 });





//object to share data among controllers and views
rubricaApp.factory('Store', function() {
 var savedData = {}
 var error = {}
 function set(data) {
   savedData = data;
 }
 function get() {
  return savedData;
 }

return {
  set: set,
  get: get
 }

});

rubricaApp.controller('ListWordsController',
    function ($scope, Word, Store) {


        Word.query(function(data) {
            $scope.submissionSuccess = Store.get()===true;
            $scope.submissionError = Store.get()==='error';
            $scope.data = data;
            Store.set("");
        },
        function(err)
        {
            console.error(err);
        });
});


rubricaApp.controller('DeleteWordController',
    function ($scope, Word, Store, $routeParams, $location) {
        console.log("Invocated delete with _id: "+$routeParams._id);
        Word.delete({_id:$routeParams._id}, function()
        {
            Store.set(true);
            $location.path('/words');
        },
        function(error)
       {
           Store.set('error');
           $location.path('/words');
       });
});

rubricaApp.controller('NewWordController',
    function ($scope, Word, Store, $location) {
      $scope.addWord = function() {
        console.log('word: '+$scope.word.sentence);
        Word.save($scope.word, function()
         {
             Store.set(true);
             $location.path('/words');

         },function(error)
         {
            Store.set('error');
            $location.path('/words');
         });
      }
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
            when('/deleteWord/:_id', {
                controller:  'DeleteWordController',
                templateUrl: 'views/home.html'
            }).
            when('/newWord', {
                controller:  'NewWordController',
                templateUrl: 'views/newWord.html'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);


