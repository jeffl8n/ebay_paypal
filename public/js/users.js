var journalAdmins = angular.module('journalAdmins', []).filter('classy', function(){
    return function(text){
        return String(text).replace(/ /mg, '-');
    }
});

journalAdmins.controller('mainController',  ['$scope', '$http', '$window', function($scope, $http, $window) {
      $scope.users

    $http.get('/api/users')
    .success(function(data) {
        $scope.users = data;
        console.log("data " ,data);
    })
    .error(function(data) {
        console.log('Error: ' + data);
    });

    $scope.resetPassword = function(idx, user) {
      console.log('user ', user.username)
      $http.post('/api/user/password'+user._id, user)
        .success(function(data) {
                console.log(data);
                
            })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    }

    // delete a question after checking it
    $scope.deleteUser = function(idx, id) {
      var areYouSure = $window.confirm('Are you sure you really want to delete this user?')
      if(areYouSure){
        $http.delete('/api/users/' + id)
        .success(function(data) {
            $scope.users.splice(idx, 1)
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
      }
        
    };
}]);