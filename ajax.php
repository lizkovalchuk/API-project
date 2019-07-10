<?php

//this is a GET request to the Bike Index API
//this file echo's the API's results.
//the results are accessed via an ajax request

$url = "https://bikeindex.org/api/v3/search?page=1&per_page=100&location=Toronto&distance=10&stolenness=proximity";


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



