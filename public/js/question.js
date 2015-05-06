var activeSlice;
var categoryColorsArray = ['#3071A9','#5cb85c','#5bc0de','#f0ad4e', '#d9534f'];
var journalQuestion = angular.module('journalQuestion', [ 'nvd3ChartDirectives']).filter('classy', function(){
    return function(text){
        return String(text).replace(/ /mg, '-');
    }
});

journalQuestion.controller('mainController',  ['$scope', '$http', function($scope, $http) {
    $scope.cat_selected = false;
    $scope.responded = false;
    $scope.formData = {};
    $scope.pieData = [];

    $scope.colorFunction = function() {
        return function(d, i) {
            return categoryColorsArray[i];
        };
    }

    $scope.$on('elementClick.directive', function(angularEvent, event){
        console.log( 'elementClick ',event)
        console.log('switch to ',event.label)
         $scope.categoryChange(event.label)

    });

    $scope.$on('chartClick.directive', function(angularEvent, event){
        console.log( 'chartClick ',event)

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
     createFilter()        
        })
    .error(function(data) {
            //console.log('Error: ' + data);
        });

    $scope.categorySelected = function(category){
     $scope.cat_selected = true
     $scope.formData.category = category
      addEffect(category)
 }

 $scope.categoryChange = function(category){
     addEffect(category)
    console.log('changing to ',category)
    $http.get('/api/responses/qid/'+qid+'/'+category)
    .success(function(data) {
        $scope.responses = data;
           console.log("cat data", data);
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
                $http.get('/api/responses/count/'+qid)
                    .success(function(data) {
                     $scope.pieData = data;          
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

var activeSlicePath
var activeSlice
var radius = 200;
var biggerSlice = d3.svg.arc().outerRadius(210).innerRadius(90);
var normalSlice = d3.svg.arc().outerRadius(180).innerRadius(90);
function addEffect(category){

// d3.select('.nv-slice').data()[0].data['key']
var arcs = d3.selectAll(".nv-slice")
arcs.each(function(d,i){

    if(d3.select(this).data()[0].data['key'] == category){
         activeSlice = d3.select(this)

        activeSlicePath = d3.select(this).select('path')
       // activeSlicePath.outerRadius(radius+10)
        activeSlicePath.style("filter", "url(#drop-shadow)")
        activeSlicePath.transition().duration(200).attr("d",biggerSlice)
        // activeSlicePath.style('stroke', activeSlicePath.style('fill'))
        //activeSlicePath.style('stroke-width', 15)
    }else{
        d3.select(this).select('path').transition().duration(200).attr("d",normalSlice)
           d3.select(this).select('path').style("filter", null)
        // d3.select(this).select('path').style('stroke', '#ffffff')
        //d3.select(this).select('path').style('stroke-width', 1)
    }

})
arcs.sort(function(a,b){
    if(a['data']['key'] != category) return -1
        else return 1
})
console.log('slice', activeSlice.id)


}
var svg;
var defs;
var filter;

function createFilter(){
svg = d3.select('svg');
// filters go in defs element
defs = svg.append("defs");

// create filter with id #drop-shadow
// height=130% so that the shadow is not clipped
filter = defs.append("filter")
    .attr("id", "drop-shadow")
    .attr("height", "120%");

// SourceAlpha refers to opacity of graphic that this filter will be applied to
// convolve that with a Gaussian with standard deviation 3 and store result
// in blur
filter.append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 2)
    .attr("result", "blur");

// translate output of Gaussian blur to the right and downwards with 2px
// store result in offsetBlur
filter.append("feOffset")
    .attr("in", "blur")
    .attr("dx", 2)
    .attr("dy", 2)
    .attr("result", "offsetBlur");

// overlay original SourceGraphic over translated blurred opacity by using
// feMerge filter. Order of specifying inputs is important!
var feMerge = filter.append("feMerge");

feMerge.append("feMergeNode")
    .attr("in", "offsetBlur")
feMerge.append("feMergeNode")
    .attr("in", "SourceGraphic");

}
