// ======================MAP FUNCTIONALITY =======================//

//global variables:

var bikecounter = 0;
var bikes = null;
var timer;
var bikeIdsObj = {};

//initMap() creates the initial map
var map;

function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: { lat: 43.6532, lng: -79.3832 }
    });

    directionsDisplay.setMap(map);

    var _click = function () {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    };
    document.getElementById('submit').addEventListener('click', _click);
    ajaxToBikeApi();
}

function getBikeIds(bikes) {

    for( i = 0; i < bikes.bikes.length; i++){
        var bikeId = bikes.bikes[i].id.toString()


        $.ajax({
            url:"bike-locations.php", method: "POST",
            data: { bikeId: bikeId },
            success:function(response){
                bike = JSON.parse(response);
                var latitude = bike.bike.stolen_record.latitude;
                var longitude = bike.bike.stolen_record.longitude;
                addMarkers(latitude, longitude);
            }
        });
    }
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
        origin: document.getElementById('start_city').value,
        destination: document.getElementById('dest_city').value,
        travelMode: "BICYCLING"
    }, function (response, status) {
        if (status === 'OK') {

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
    $.ajax({
        url:"toronto-bikes.php", method: "POST",
        success:function(response){
            bikes = JSON.parse(response);
            getBikeIds(bikes);
            timer =  setInterval(function(){  
                geocoder();
            }, 1000);
            if(bikecounter == bikes.bikes.length){
                clearInterval(timer);
            }
        }
    });
}

function geocoder() {

    var markers = [];
    var markerCluster = new MarkerClusterer(map, markers,
        { imagePath: 'images/m1.png' });
    var limit = bikecounter + 10;

    limit = bikecounter + 10;
    if(limit > bikes.bikes.length){
        limit = bikes.bikes.length;
    }

    for (i = bikecounter; i < limit; i++) {

        var gcoder = new google.maps.Geocoder();
        var address = bikes.bikes[i].stolen_location;

        gcoder.geocode(
            {'address': address},
            function (results, status){
                if(status == 'OK'){
                    var marker = new google.maps.Marker({
                        position: results[0].geometry.location,
                        map: map
                    });

                    markers.push(marker);
                    markerCluster.addMarker(marker);
                }
                google.maps.event.addDomListener(window, 'load');
            });
        bikecounter = i;
    }
    bikecounter++;
};

function addMarkers(latitude, longitude) {
    if (latitude && longitude ) {
        var location = {lat: latitude, lng: longitude};
        var markers = [];

        var markerCluster = new MarkerClusterer(map, markers,
            { imagePath: 'images/m1.png' });

        var marker = new google.maps.Marker({
            position: location,
            map: map
        });

        markers.push(marker);
        markerCluster.addMarker(marker);
        google.maps.event.addDomListener(window, 'load');
    }
}

