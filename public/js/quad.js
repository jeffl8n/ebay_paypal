var company = 'ebay';
var categoryColors = []
var journalQuestion = angular.module('journalQuestion', [ 'nvd3ChartDirectives'])
journalQuestion.filter('classy', function(){
    return function(text){
        return String(text).replace(/ /mg, '-');
    }
});
journalQuestion.filter('catFilter', function(){
    return function( items, activeCategory) {
    var filtered = [];
    angular.forEach(items, function(item) {
       if( item.category.match(activeCategory) ){
          filtered.push(item);
        }

    });

    return filtered;
  };
});

journalQuestion.filter('subCatFilter', function(){
    return function( items, activeSubCategory) {
    var filtered = [];
    angular.forEach(items, function(item) {
         if(  item.sub_category == activeSubCategory ){
          filtered.push(item);
        }

    });

    return filtered;
  };
});


journalQuestion.controller('mainController',  ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
    $scope.cat_selected = false;
    $scope.responded = false;
    $scope.votedFor = [];
    $scope.activeSubCategory = "Insider";

      $scope.learnerResponses = [
        {
            'sub_category': 'Insider',
            'category': 'benefits',
            'question': qid
        },{
            'sub_category': 'Insider',
            'category': 'risks',
            'question': qid
        },{
            'sub_category': 'Outsider',
            'category': 'benefits',
            'question': qid
        },{
            'sub_category': 'Outsider',
            'category': 'risks',
            'question': qid
        }

      ];


    $http.get('/api/questions/'+qid)
    .success(function(data) {
        $scope.question = data;
        company = data.group;

        })
    .error(function(data) {
        console.log('Error: ' + data);
    });


    $http.get('/api/responses/qid/'+qid)
    .success(function(data) {
        $scope.responses = data;
       })
    .error(function(data) {
        console.log('Error: ' + data);
    });

    $scope.categorySelected = function(category){
     $scope.cat_selected = true
     $scope.activeCategory = category
      addEffect(category)
 }


 $scope.categoryChange = function(category){
     addEffect(category)
    
}



    // when submitting the add form, send the text to the node API
    $scope.createResponses = function() {
        angular.forEach($scope.learnerResponses, function(response) {
          console.log(response)
          $http.post('/api/responses', response)
           .success(function(data) {
                    $scope.responses = data;
            })
           .error(function(data) {
            console.log('Error: ' + data);
            });
        });
        $scope.responded = true
       

   };

    $scope.vote =function(response){
        var id = response._id
    if($('#vote_'+id).hasClass('glyphicon-plus')){
        $http.post('/api/responses/vote/' + id)
        .success(function(data) {
           response.votes++
           response.icon = "glyphicon-minus"
       })
        .error(function(data) {
            console.log('Error: ' + data);
        }); 
    }else{
        $http.delete('/api/responses/vote/' + id)
        .success(function(data) {
          response.votes--
          response.icon = "glyphicon-plus"
      })
        .error(function(data) {
            console.log('Error: ' + data);
        }); 
    }
    $('#vote_'+id).toggleClass('glyphicon-plus').toggleClass('glyphicon-minus')

};

    $scope.flag =function(response){
        var id = response._id
 
        $http.post('/api/responses/flag/' + id)
        .success(function(data) {

       })
        .error(function(data) {
            console.log('Error: ' + data);
        }); 

    $('#flag_'+id).removeClass('text-muted').addClass('text-danger')

};


}]);

// a directive to auto-collapse long text
// in elements with the "dd-text-collapse" attribute
journalQuestion.directive('ddTextCollapse', ['$compile', function($compile) {

    return {
        restrict: 'A',
        scope: true,
        link: function(scope, element, attrs) {

            // start collapsed
            scope.collapsed = false;

            // create the function to toggle the collapse
            scope.toggle = function() {
                scope.collapsed = !scope.collapsed;
            };

            // wait for changes on the text
            attrs.$observe('ddTextCollapseText', function(text) {

                // get the length from the attributes
                var maxLength = scope.$eval(attrs.ddTextCollapseMaxLength);

                if (text.length > maxLength) {
                    // split the text in two parts, the first always showing
                    var firstPart = String(text).substring(0, maxLength);
                    var secondPart = String(text).substring(maxLength, text.length);

                    // create some new html elements to hold the separate info
                    var firstSpan = $compile('<span>' + firstPart + '</span>')(scope);
                    var secondSpan = $compile('<span ng-if="collapsed">' + secondPart + '</span>')(scope);
                    var moreIndicatorSpan = $compile('<span ng-if="!collapsed">... </span>')(scope);
                    var lineBreak = $compile('<br ng-if="collapsed">')(scope);
                    var toggleButton = $compile('<span class="collapse-text-toggle" ng-click="toggle()">{{collapsed ? "view less" : "view all"}}</span>')(scope);

                    // remove the current contents of the element
                    // and add the new ones we created
                    element.empty();
                    element.append(firstSpan);
                    element.append(secondSpan);
                    element.append(moreIndicatorSpan);
                    element.append(lineBreak);
                    element.append(toggleButton);
                }
                else {
                    element.empty();
                    element.append(text);
                }
            });
        }
    };
}]);