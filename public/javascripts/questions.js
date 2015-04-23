
var journalQuestions = angular.module('journalQuestions', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all questions and show them
    $http.get('/api/questions')
        .success(function(data) {
            $scope.questions = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createQuestion = function() {
        $http.post('/api/questions', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.questions = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a question after checking it
    $scope.deleteQuestion = function(id) {
        $http.delete('/api/questions/' + id)
            .success(function(data) {
                $scope.questions = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}
