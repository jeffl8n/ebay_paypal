var journalAdmins = angular.module('journalAdmins', []).filter('classy', function(){
    return function(text){
        return String(text).replace(/ /mg, '-');
    }
});

journalAdmins.controller('mainController',  ['$scope', '$http', '$window', function($scope, $http, $window) {
      $scope.responses
    // when landing on the page, get all responses and show them
    $http.get('/api/users')
    .success(function(data) {
        $scope.users = data;
        console.log("data " ,data);
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

    // delete a question after checking it
    $scope.deleteResponse = function(idx, id) {
      var areYouSure = $window.confirm('Are you sure you really want to delete this response?')
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