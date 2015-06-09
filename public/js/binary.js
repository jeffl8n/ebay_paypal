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
    $scope.responseCount = 0;
    $scope.activeSubCategory;
     $scope.formData = {};

    $http.get('/api/questions/'+qid)
    .success(function(data) {
        $scope.question = data;
        $scope.formData.question = data._id;
        company = data.group;
        if($scope.question.group =="paypal"){
            categoryColors = [{catagory:'PayPal',color: '#009CDE'},{catagory:'QuickBooks',color: '#003087'}]
        }else{
             categoryColors = ebayColors
        }

        })
    .error(function(data) {
        console.log('Error: ' + data);
    });

    $http.get('/api/responses/count/'+qid)
    .success(function(data) {
     $scope.pieData = data; 
      angular.forEach($scope.pieData[0]['values'], function(value, key){
        $scope.responseCount += value[1];
      })
       
        })
    .error(function(data) {
            //console.log('Error: ' + data);
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

 }


    $scope.colorFunction = function() {
        return function(d, i) {
            console.log(d[0])
            for(var key in categoryColors){
                if(categoryColors[key].catagory==d[0]){
                    return categoryColors[key].color
                }      
            }
        };
    }


$scope.valueFormatFunction = function(){
    return function(d){
        var per = (d / $scope.responseCount )
        return d3.format('%')(per);
    }
}



    $scope.xFunction = function(){
        return function(d) {
            return d.key;
        };
    }

    $scope.yFunction = function(){
        return function(d){
            return d.y;
        };
    }
    $scope.xFunctionBar = function(){
        return function(x){
            return x[0];
        };
    }
     $scope.yFunctionBar = function(){
        return function(y){
            return y[1];
        };
    }


 $scope.categoryChange = function(category){

    
}



    // when submitting the add form, send the text to the node API
    $scope.createResponse = function() {
        $scope.formData.category =  $scope.activeCategory 
        $http.post('/api/responses', $scope.formData)
       .success(function(data) {
                $scope.responses = data;
                $scope.responded =true
                $http.get('/api/responses/count/'+qid)
                    .success(function(data) {
                     $scope.pieData = data; 
                     angular.forEach($scope.pieData[0]['values'], function(value, key){
                        $scope.responseCount += value[1];
                      })       
                        })
                    .error(function(data) {
                            //console.log('Error: ' + data);
                        });
                            })
       .error(function(data) {
        console.log('Error: ' + data);
    });
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