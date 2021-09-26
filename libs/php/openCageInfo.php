<?php


    // Echo all errors back to the screen of the browser so PHP can be debugged
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    // Initialize cURL
    $url = "https://api.opencagedata.com/geocode/v1/json?q=". $_REQUEST['lat']. "+".$_REQUEST['lng']."&key=200a79aaae3747c6ade4bd658a9800e9";
    

    $ch= curl_init();
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);

    // Store the data
    $countryData = curl_exec($ch);
    
    // End the cURL
    curl_close($ch);

    // Decode JSON response
    $code = json_decode($countryData, true);


     $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data']['iso3'] = $code['results'][0]['components']['ISO_3166-1_alpha-3'];
    $output['data']['country'] = $code['results'][0]['components']['country'];
    $output['data']['iso2'] = $code['results'][0]['components']['ISO_3166-1_alpha-2'];
    $output['data']['all'] = $code;
    


    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);


    ////////////////////////////////////////////////



?>