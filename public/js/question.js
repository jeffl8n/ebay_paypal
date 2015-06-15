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
       if( activeCategory == 'all' || item.category.match(activeCategory) ){
          filtered.push(item);
        }

    });

    return filtered;
  };
});
journalQuestion.filter('locFilter', function(){
    return function( items, activeLocation) {
    var filtered = [];
    angular.forEach(items, function(item) {
         if( activeLocation == 'All' || item.location == activeLocation ){
          filtered.push(item);
        }

    });

    return filtered;
  };
});

journalQuestion.controller('mainController',  ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
    $scope.cat_selected = false;
    $scope.responded = false;
    $scope.formData = {};
    $scope.pieData = [];
    $scope.votedFor = [];
    $scope.activeCategory
    $scope.formData.category = 'Select an answer'
    $scope.activeLocation = 'Select your location'
    

    $scope.colorFunction = function() {
        return function(d, i) {
            for(var key in categoryColors){
                if(categoryColors[key].catagory==d.data.key){
                    return categoryColors[key].color
                }      
            }
        };
    }

    $scope.$on('elementClick.directive', function(angularEvent, event){
        $scope.$apply(function () {               // 3
            $scope.activeCategory = event.label
          });
        
         $scope.categoryChange(event.label)
    });

     $scope.$on('stateChange.directive', function(angularEvent, event){
  
     // addEffect(activeCategory )

    });

    $scope.xAxisTickFormatFunction = function(){
        return function(d){
            return d3.time.format('%b')(new Date(d));
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
    
    
    // when landing on the page, get all questions and show them
    $http.get('/api/questions/'+qid)
    .success(function(data) {
        $scope.question = data;
        $scope.formData.question = data._id;
        $scope.formData.group = data.group;
        company = data.group;
        if(data.type == 'bar'){
            $scope.activeLocation = 'All'
        }
        if($scope.question.group =="paypal"){
            categoryColors = paypalColors
        }else{
             categoryColors = ebayColors
        }
        $scope.formData.learner = "mee";
            //console.log(data);
        })
    .error(function(data) {
        console.log('Error: ' + data);
    });


    $http.get('/api/responses/count/'+qid)
    .success(function(data) {
     $scope.pieData = data; 
     if($scope.question.type == 'pie'){
         setTimeout(function(){createCenter()},500) ;         
         createFilter()
     }        
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
     $scope.formData.category = category
     $scope.activeCategory = category
      addEffect(category)
 }


    $scope.locationSelected = function(location){
     $scope.loc_selected = true
     $scope.formData.location = location
     $scope.activeLocation = location
     var service_url = '/api/responses/count/'+qid
     if(location != 'All'){
        service_url += '/'+location
     }
     $http.get(service_url)
                    .success(function(data) {
                     $scope.pieData = data;  

                    setTimeout(function(){
                        addEffect(activeCategory)
                    },500)         
                        })
                    .error(function(data) {
                            //console.log('Error: ' + data);
                        });
 }

 $scope.categoryChange = function(category){
     addEffect(category)
    
}

$scope.legendClick = function(category){
    $scope.activeCategory = category
    addEffect(category)
}

    // when submitting the add form, send the text to the node API
    $scope.createResponse = function() {
        resetSlices()
       $http.post('/api/responses', $scope.formData)
       .success(function(data) {
                $scope.activeCategory = $scope.formData.category
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.responses = data;
                $scope.responded =true
                $http.get('/api/responses/count/'+qid)
                    .success(function(data) {
                     $scope.pieData = data;  

                    setTimeout(function(){
                        addEffect(activeCategory)
                    },500)         
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
var activeCategory 
var activeSlicePath
var activeSlice
var radius = 200;
var biggerSlice = d3.svg.arc().outerRadius(200).innerRadius(90);
var normalSlice = d3.svg.arc().outerRadius(180).innerRadius(90);
function addEffect(category){

activeCategory  = category
var arcs = d3.selectAll(".nv-slice")
arcs.each(function(d,i){
     
    if(d3.select(this).data()[0].data['key'] == category){
         activeSlice = d3.select(this)
        activeSlicePath = d3.select(this).select('path')
        activeSlicePath.style("filter", "url(#drop-shadow)")
        activeSlicePath.transition().duration(200).attr("d",biggerSlice)
    }else{
        d3.select(this).select('path').transition().duration(200).attr("d",normalSlice)
           d3.select(this).select('path').style("filter", null)
    }

})
arcs.sort(function(a,b){
    if(a['data']['key'] != category) return -1
        else return 1
})

}

function resetSlices(){
    var arcs = d3.selectAll(".nv-slice")
    arcs.each(function(d,i){
        d3.select(this).select('path').transition().duration(200).attr("d",normalSlice)
        d3.select(this).select('path').style("filter", null)
    })

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

function createCenter(){
    var svgPie = d3.select('.nv-pieWrap');
    svgPie.append('svg:image')
    .attr('xlink:href','../images/'+company+'.png')
    .attr('width',110)
    .attr('height',110)
    .attr('x',150)
    .attr('y',150);

    
    var labels = d3.selectAll('.nv-label')
    labels.each(function(d,i){
        var top_str = d3.select(this).attr('transform')
        var top = Number(top_str.substring(0, top_str.length - 1).split(',')[1])
        if(top > 0){
              console.log(top) 
              d3.select(this).select('text').attr('transform', function(d,i,j) {
                    return 'translate (0, 10) ' 
                }) ;    
        }

    })



}


//jquery setup cover

$(function() {
    $('#coverUp').css('left',$('#side_bar').outerWidth())
    $('#coverUp').width($(window).width()-$('#side_bar').outerWidth())
    $('#coverUp').height($(window).height())
});