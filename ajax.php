<?php

//this is a get request to the API
//this echo's the API's results.
//then I plug the results into jquery via an ajax request
//so I can plug those results into a google API.


//$url = "https://bikeindex.org:443/api/v3/search?stolenness=stolen";
$url = "https://bikeindex.org:443/api/v3/search?page=1&per_page=50&location=IP&distance=10&stolenness=proximity";


//I think I need to make another request to a geocode API.
// Ideally I would feed it the JSON from the API request on line 10



$curl = curl_init();

curl_setopt_array($curl, array(
    CURLOPT_URL =>$url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
    CURLOPT_HTTPHEADER => array(
    "cache-control: no-cache"
  )
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);
echo $response;

//$response = json_decode($response);
////echo json_encode($response)
//echo $response;

