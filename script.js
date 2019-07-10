// ======================MAP FUNCTIONALITY =======================//

//global variables:

var bikecounter = 0;
var bikesFromAPIresponse = null;
var timer;
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

//this function creates the route.
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

function ajaxToBikeApi() {
    $.ajax({
        url: "ajax.php", method: "POST",
        success: function (response) {
            bikesFromAPIresponse = JSON.parse(response);
            timer = setInterval(function () {
                geoCode();
            }, 1000);
            if (bikecounter == bikesFromAPIresponse.bikes.length) {
                clearInterval(timer);
            }
        }
    });
}

function geoCode() {

    var markers = [];
    var markerCluster = new MarkerClusterer(map, markers,
        { imagePath: 'images/m1.png' });
    var limit = bikecounter + 10;

    if (limit > bikesFromAPIresponse.bikes.length) {
        limit = bikesFromAPIresponse.bikes.length;
    }

    for (i = bikecounter; i < limit; i++) {

        var gcoder = new google.maps.Geocoder();
        var address = bikesFromAPIresponse.bikes[i].stolen_location;
        gcoder.geocode(
            { 'address': address },
            function (results, status) {
                if (status == 'OK') {
                    var marker = new google.maps.Marker({
                        position: results[0].geometry.location,
                        map: map
                    });

                    // push the lat and longs (stored in marker variable on line 88) created in your loop
                    // into the markers array defined outside the loop as well as the markerCluster function

                    markers.push(marker);
                    markerCluster.addMarker(marker);
                }
                google.maps.event.addDomListener(window, 'load');
            });
        bikecounter = i;
    }
    bikecounter++;
}

