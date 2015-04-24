
var journalQuestions = angular.module('journalQuestions', []);

function mainController($scope, $http) {
    $scope.formData = {};


    $scope.copyLink = function(qID){
        console.log('qID ' + qID); 
        /*var qLink = document.querySelector('#'+qID);  
      var range = document.createRange();  
      range.selectNode(qLink);  
      window.getSelection().addRange(range);  
        
      try {  
        // Now that we've selected the anchor text, execute the copy command  
        var successful = document.execCommand('copy');  
        var msg = successful ? 'successful' : 'unsuccessful';  
        console.log('Copy email command was ' + msg);  
      } catch(err) {  
        console.log('Oops, unable to copy');  
      }  
        
      // Remove the selections - NOTE: Should use   
      // removeRange(range) when it is supported  
      window.getSelection().removeAllRanges();  
      */
    }
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


