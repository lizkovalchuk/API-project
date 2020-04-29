<?php

$bikes = isset($_REQUEST['bikeIdsObj']) ? $_REQUEST['bikeIdsObj'] : '';


foreach ($bikes as $v) {
  $curl = curl_init();

  curl_setopt_array($curl, array(
      CURLOPT_URL =>"https://bikeindex.org:443/api/v3/bikes/$v",
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
}

