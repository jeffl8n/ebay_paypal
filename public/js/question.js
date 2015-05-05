var activeSlice;

var journalQuestion = angular.module('journalQuestion', ['nvd3']).filter('classy', function(){
    return function(text){
        return String(text).replace(/ /mg, '-');
    }
});

journalQuestion.controller('mainController',  ['$scope', '$http', function($scope, $http) {
    $scope.cat_selected = false;
    $scope.responded = false;
    $scope.formData = {};
    $scope.pieData = [
    { key: "One", y: 5 },
    { key: "Two", y: 2 },
    { key: "Three", y: 9 },
    { key: "Four", y: 7 },
    { key: "Five", y: 4 }
    ];

    $scope.$on('elementClick.directive', function(angularEvent, event){
        console.log( 'pos ',event.pos)
        activeSlice = event.pos.target

        $(activeSlice).toggleClass("selectedSlice");
    });


    $scope.$on('legendClick.directive', function(angularEvent, event){
      console.log('legendClick ',event)
  });

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
    
    $scope.formData.category = 'Select an answer'
    // when landing on the page, get all questions and show them
    $http.get('/api/questions/'+qid)
    .success(function(data) {
        $scope.question = data;
        $scope.formData.question = data._id;
        $scope.formData.group = data.group;
        $scope.formData.learner = "mee";
            //console.log(data);
        })
    .error(function(data) {
        console.log('Error: ' + data);
    });


    $http.get('/api/responses/count/'+qid)
    .success(function(data) {
     $scope.pieData = data;
     console.log("pieData",$scope.chart);
            /*var chart = d3.select("#chart")
            for (var property in chart.legend.dispatch) {
                chart.legend.dispatch[property] = function() { };
            }*/
        })
    .error(function(data) {
            //console.log('Error: ' + data);
        });

    $scope.categorySelected = function(category){
     $scope.cat_selected = true
     $scope.formData.category = category
 }

 $scope.categoryChange = function(category){

    $http.get('/api/responses/qid/'+qid+'/'+$scope.formData.category)
    .success(function(data) {
        $scope.responses = data;
           // console.log(data);
       })
    .error(function(data) {
        console.log('Error: ' + data);
    });
}

    // when submitting the add form, send the text to the node API
    $scope.createResponse = function() {
       console.log('createResponse ');
       $http.post('/api/responses', $scope.formData)
       .success(function(data) {
        console.log('success: ' + data);
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.responses = data;
                $scope.responded =true
                //console.log(data);
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
                //console.log(data);
            })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };
    $scope.vote =function(response){
        var id = response._id
    //console.log(response._id)
    if($('#vote_'+id).hasClass('glyphicon-plus')){
        $http.post('/api/responses/vote/' + id)
        .success(function(data) {
           // console.log('success '+data);
           response.votes++
       })
        .error(function(data) {
            console.log('Error: ' + data);
        }); 
    }else{
        $http.delete('/api/responses/vote/' + id)
        .success(function(data) {
          //  console.log('success '+data);
          response.votes--
      })
        .error(function(data) {
            console.log('Error: ' + data);
        }); 
    }
    $('#vote_'+id).toggleClass('glyphicon-plus').toggleClass('glyphicon-minus')

};
}]);

var w = 400;
var h = 400;
var r = h/2;
var arc = d3.svg.arc().outerRadius(r);
var arcOver = d3.svg.arc().outerRadius(r + 10);

function addEffect(){

    var w = 400;
    var h = 400;
    var r = h/2;

    var pie = d3.layout.pie().value(function(d){return d.value;});

// declare an arc generator function
var arc = d3.svg.arc().outerRadius(r);
var arcOver = d3.svg.arc().outerRadius(r + 10);

// select paths, use arc generator to draw
var arcs = d3.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
/*arcs.append("svg:path")
    .attr("d", function (d) {
        // log the result of the arc generator to show how cool it is :)
        console.log(arc(d));
        return arc(d);
    })
     .on("mouseenter", function(d) {
            d3.select(this)
               .attr("stroke","white")
               .transition()
               .duration(1000)
               .attr("d", arcOver)             
               .attr("stroke-width",6);
        })
        .on("mouseleave", function(d) {
            d3.select(this).transition()            
               .attr("d", arc)
               .attr("stroke","none");
        });;
*/

}


