var journalQuestions = angular.module('journalResponses', []).filter('classy', function(){
    return function(text){
        return String(text).replace(/ /mg, '-');
    }
});

journalQuestions.controller('mainController',  ['$scope', '$http', '$window', function($scope, $http, $window) {
      $scope.responses
      $scope.filteredLength = 0
      $scope.flagsOnly = true
    // when landing on the page, get all responses and show them
    $http.get('/api/moderate/responses')
    .success(function(data) {
        $scope.responses = data;
    })
    .error(function(data) {
        console.log('Error: ' + data);
    });

    $scope.updateResponse = function(idx, response) {
      console.log('response ', response.text)
      $http.post('/api/responses/'+response._id, response)
        .success(function(data) {
                console.log(data);
                response.changed=false;
            })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    }

    $scope.updateFlag = function(idx, response) {
        var id = response._id
      if(response.flags!=0){
            $http.delete('/api/responses/flag/' + id)
            .success(function(data) {
                response.flags = 0;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        
        }else{
            $http.post('/api/responses/flag/' + id)
            .success(function(data) {
                response.flags++
           })
            .error(function(data) {
                console.log('Error: ' + data);
            }); 
        }

      

    }

    // delete a question after checking it
    $scope.deleteResponse = function(idx, id) {
      var areYouSure = $window.confirm('Are you sure you really want to DELETE this response?')
      if(areYouSure){
        $http.delete('/api/responses/' + id)
        .success(function(data) {
            $scope.responses.splice(idx, 1)
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
      }
        
    };
}]);

journalQuestions.filter('flagFilter', function(){
    return function( items, flagsOnly) {
    var filtered = [];
    angular.forEach(items, function(item) {
       if( !flagsOnly || item.flags !=0) {
          filtered.push(item);
        }

    });
    return filtered;
  };
});