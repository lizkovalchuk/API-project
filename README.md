# Stolen Bikes

## What's happening

This small application uses PHP to make a `curl` request to a free API called Bikes Index.

[Bike Index API](https://bikeindex.org/documentation/api_v3)

The response is then collected using AJAX

```javascript
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
```

Notice that a timer is being called. This is because the GeoCode can only turn 10 address into long and lats per second and the Bike API returns address, not lats and longs. And the map markers need lat and longs.

The `timer` is calling the `geoCode` function every second. This function loops through the JSON response from Bike Index API and pumps 10 address entries into Google's geocode method. Then results from Google's `geocode` are stored in a `var` called `marker` and then `marker` is pumped into a `markers` array and Google's `MarkerClusterer` library to enable marker clustering.


```javascript
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
```