// ======================MAP FUNCTIONALITY =======================//

//global variables:

var bikecounter = 0;
var a = null;
var timer;

//initMap() creates the initial map
var map;
function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: {lat: 43.6532, lng: -79.3832}
    });

    directionsDisplay.setMap(map);

    var _click = function() {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    };
    document.getElementById('submit').addEventListener('click', _click);
    ajaxToBikeApi();
}

//this function creates the route.
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
        origin: document.getElementById('start_city').value,
        destination: document.getElementById('dest_city').value,
        travelMode: "BICYCLING"
    }, function(response, status) {
        if (status === 'OK') {
            //console.log(response.routes[0].legs[0].duration.text);

            // var results are extracted from JSON object
            var result = response.routes[0].legs[0].duration.text;
            directionsDisplay.setDirections(response);
            document.getElementById("result").innerHTML = result;

        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

// this function sends a request to retrieve a JSON
// to plug into my javascript API

function ajaxToBikeApi(){
    // var a = null;
    $.ajax({
        url:"ajax.php", method: "POST",
        success:function(response){
            // console.log(JSON.parse(response));
            a = JSON.parse(response);
 //            createClusters(a);
            //console.log(a.bikes[0]);
             timer =  setInterval(function(){  
                test();
            }, 1000);
            if(bikecounter == a.bikes.length){
                clearInterval(timer);
            }
        }
    });
}

function test(){

    var markers=[];
    var markerCluster = new MarkerClusterer(map, markers,
        {imagePath: 'images/m1.png'});

    limit = bikecounter + 10;
    if(limit > a.bikes.length){
        limit = a.bikes.length;
    }

    for(i = bikecounter; i < limit; i++){

        var gcoder = new google.maps.Geocoder();
        var address = a.bikes[i].stolen_location;
        gcoder.geocode(
            {'address': address},
            function (results, status){
                if(status == 'OK'){
                    // console.log(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        position: results[0].geometry.location,
                        map:map
                    });

//push the markers created in your loop and push the markers
//into the array defined outside the loop.

                    markers.push(marker);
                    markerCluster.addMarker(marker);
                }
                else{
                    // console.log(results);
                    console.log(address);
                }
                google.maps.event.addDomListener(window, 'load');
            });
        bikecounter = i;
    }
    bikecounter++;
    console.log(bikecounter);
}

